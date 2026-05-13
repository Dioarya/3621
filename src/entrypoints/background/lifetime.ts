import type { ExtensionMessage, RemoveListenerCallback } from "@webext-core/messaging";
import type { MutexInterface } from "async-mutex";

import cloneDeep from "lodash-es/cloneDeep";
import filter from "lodash-es/filter";
import isEqual from "lodash-es/isEqual";
import isMatch from "lodash-es/isMatch";
import { type Browser, browser } from "wxt/browser";

import type {
  AcknowledgedTab,
  AcknowledgedTabIdentification,
  Acknowledgement,
  Tab,
} from "@/utils/lifetime";
import type { DeepPartial, EpochMilliseconds } from "@/utils/types";

import { onMessage } from "@/utils/messaging";

import type { Lifetime } from "./object";

export function createAcknowledgementId(sender: ExtensionMessage["sender"]) {
  const tabDetail: Browser.tabs.Tab = sender.tab!;
  const frameId: number = sender.frameId!;

  const id: AcknowledgedTabIdentification = {
    tab: { id: tabDetail.id! },
    frame: { id: frameId },
  };

  return id;
}

export function setupAcknowledgementExpiry(lifetime: Lifetime) {
  const interval = setInterval(async () => {
    const now = Date.now();

    const keepExpiration = (tab: AcknowledgedTab) => {
      const lastTime = tab.acknowledgement.heartbeat.lastTime;
      const interval = tab.acknowledgement.heartbeat.interval;
      const expectedNextTime = lastTime + interval;
      if (now > expectedNextTime) {
        return false;
      }

      return true;
    };

    await lifetime.tabs.set((tabs) => {
      const filtered = tabs.filter(keepExpiration);
      if (import.meta.env.DEV) {
        const expired = tabs.length - filtered.length;
        if (expired > 0)
          console.log(`[background] log: expired ${expired} tab(s), ${filtered.length} remaining`);
      }
      return filtered;
    });
  }, lifetime.heartbeat.interval);

  return () => clearInterval(interval);
}

export function setupLifetimeMessaging(lifetime: Lifetime) {
  const cleanup: RemoveListenerCallback[] = [];

  type LockedContext = {
    tabs: AcknowledgedTab[];
    release: MutexInterface.Releaser;
  };

  // A proof of mutex ownership is passed in to acknowledgeHandler to prevent recursive functions causing deadlocks.
  const acknowledgeHandler = async (
    {
      sender,
      timestamp,
    }: {
      sender: ExtensionMessage["sender"];
      timestamp: EpochMilliseconds;
    },
    locked?: LockedContext,
  ) => {
    const tabDetail: Browser.tabs.Tab = sender.tab!;

    const fullFrames = tabDetail.id
      ? await browser.webNavigation.getAllFrames({ tabId: tabDetail.id })
      : null;

    const frames = fullFrames ? fullFrames.map((frame) => ({ frameId: frame.frameId })) : null;

    const tab: Tab = {
      id: tabDetail.id!,
      discarded: tabDetail.discarded,
      status: tabDetail.status,
      frames: frames,
    };

    const acknowledgement: Acknowledgement = lifetime.createAcknowledgement({
      startTime: timestamp,
    });
    const id: AcknowledgedTabIdentification = createAcknowledgementId(sender);
    const acknowledgedTab: AcknowledgedTab = { tab, acknowledgement, id };

    const [release, tabs] = locked ? [locked.release, locked.tabs] : await lifetime.tabs.acquire();

    if (!tabs.some((tab) => isEqual(tab.id, acknowledgedTab.id))) {
      tabs.push(acknowledgedTab);
      if (import.meta.env.DEV)
        console.log(
          `[background:lifetime] log: tab acknowledged: tabId=${id.tab.id} frameId=${id.frame.id} frames=${frames?.length ?? 0} status=${tab.status} interval=${acknowledgement.heartbeat.interval}ms`,
        );
    } else {
      if (import.meta.env.DEV)
        console.log(
          `[background:lifetime] log: tab already acknowledged, skipping: tabId=${id.tab.id} frameId=${id.frame.id}`,
        );
    }
    release();

    return acknowledgedTab.acknowledgement;
  };

  cleanup.push(onMessage("lifetime.acknowledge", acknowledgeHandler));

  cleanup.push(
    onMessage("lifetime.heartbeat", async ({ sender, timestamp }) => {
      const [release, tabs] = await lifetime.tabs.acquire();
      const id = createAcknowledgementId(sender);
      const criteria: DeepPartial<AcknowledgedTab> = { id };

      const acknowledgedTabs = filter(tabs, (item) => isMatch(item, criteria));

      if (acknowledgedTabs.length === 0) {
        if (import.meta.env.DEV)
          console.log(
            `[background:lifetime] log: heartbeat received but tab not found, re-acknowledging: tabId=${id.tab.id} frameId=${id.frame.id}`,
          );
        return acknowledgeHandler({ sender, timestamp }, { tabs, release });
      }

      const acknowledgedTab = acknowledgedTabs[0];
      const patchedAcknowledgement = cloneDeep(acknowledgedTab.acknowledgement);
      patchedAcknowledgement.heartbeat.lastTime = timestamp;
      acknowledgedTab.acknowledgement = patchedAcknowledgement;

      if (import.meta.env.DEV)
        console.log(
          `[background:lifetime] log: heartbeat received: tabId=${id.tab.id} frameId=${id.frame.id} lastTime=${timestamp} totalTabs=${tabs.length}`,
        );

      release();
      return patchedAcknowledgement;
    }),
  );

  return cleanup;
}
