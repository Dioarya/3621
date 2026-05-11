import { ExtensionMessage, RemoveListenerCallback } from "@webext-core/messaging";
import cloneDeep from "lodash-es/cloneDeep";
import filter from "lodash-es/filter";
import isEqual from "lodash-es/isEqual";
import isMatch from "lodash-es/isMatch";
import { type Browser, browser } from "wxt/browser";

import {
  type AcknowledgedTab,
  type AcknowledgedTabIdentification,
  type Acknowledgement,
  type Milliseconds,
  type EpochMilliseconds,
  type Tab,
} from "@/utils/lifetime";
import { onMessage } from "@/utils/messaging";
import { DeepPartial } from "@/utils/types";

type LifetimeArguments = {
  heartbeat: {
    interval: Milliseconds;
    safeIntervalMultiplier: number;
  };
};

type LifetimeCreateAcknowledgementArguments = {
  startTime: EpochMilliseconds;
};

export class Lifetime {
  tabs: AcknowledgedTab[];
  heartbeat: {
    interval: Milliseconds;
    safeIntervalMultiplier: number;
  };

  constructor(args: LifetimeArguments) {
    this.tabs = [];
    this.heartbeat = args.heartbeat;
  }

  createAcknowledgement(args: LifetimeCreateAcknowledgementArguments) {
    return {
      heartbeat: {
        startTime: args.startTime,
        lastTime: args.startTime,
        safeIntervalMultiplier: this.heartbeat.safeIntervalMultiplier,
        interval: this.heartbeat.interval,
      },
    };
  }
}

export function createAcknowledgementId(sender: ExtensionMessage["sender"]) {
  const tabDetail: Browser.tabs.Tab = sender.tab!;
  const frameId: number = sender.frameId!;

  const id: AcknowledgedTabIdentification = {
    tab: { id: tabDetail.id! },
    frame: { id: frameId },
  };

  return id;
}

export function setupLifetimeMessaging(lifetime: Lifetime) {
  const cleanup: RemoveListenerCallback[] = [];

  const acknowledgeHandler = async ({
    sender,
    timestamp,
  }: {
    sender: ExtensionMessage["sender"];
    timestamp: EpochMilliseconds;
  }) => {
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

    if (!lifetime.tabs.some((tab) => isEqual(tab.id, acknowledgedTab.id)))
      lifetime.tabs.push(acknowledgedTab);

    return acknowledgedTab.acknowledgement;
  };

  cleanup.push(onMessage("lifetime.acknowledge", acknowledgeHandler));

  cleanup.push(
    onMessage("lifetime.heartbeat", async ({ sender, timestamp }) => {
      const id = createAcknowledgementId(sender);

      const criteria: DeepPartial<AcknowledgedTab> = { id };
      const acknowledgedTabs = filter(lifetime.tabs, (item) => isMatch(item, criteria));

      if (acknowledgedTabs.length === 0) return acknowledgeHandler({ sender, timestamp });

      const acknowledgedTab = acknowledgedTabs[0];

      const patchedAcknowledgement = cloneDeep(acknowledgedTab.acknowledgement);
      patchedAcknowledgement.heartbeat.lastTime = timestamp;

      acknowledgedTab.acknowledgement = patchedAcknowledgement;
      return patchedAcknowledgement;
    }),
  );

  return cleanup;
}
