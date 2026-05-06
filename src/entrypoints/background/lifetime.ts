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

export function patchAcknowledgement(acknowledgement: Acknowledgement, now: EpochMilliseconds) {
  const clone = cloneDeep(acknowledgement);
  clone.heartbeat.lastTime = now;
  return clone;
}

export type FindAcknowledgementArguments = DeepPartial<AcknowledgedTab>;

export function findAcknowledgement(lifetime: Lifetime, searchParam: FindAcknowledgementArguments) {
  return filter(lifetime.tabs, (item) => isMatch(item, searchParam));
}

export function addAcknowledgements(lifetime: Lifetime, acknowledgedTab: AcknowledgedTab) {
  for (const tab of lifetime.tabs) if (isEqual(tab.id, acknowledgedTab.id)) return;

  lifetime.tabs.push(acknowledgedTab);
}

export function expireAcknowledgements(lifetime: Lifetime, now: EpochMilliseconds) {
  const keepExpiration = (tab: AcknowledgedTab) => {
    const lastTime = tab.acknowledgement.heartbeat.lastTime;
    const interval = tab.acknowledgement.heartbeat.interval;
    const expectedNextTime = lastTime + interval;
    if (now > expectedNextTime) {
      return false;
    }

    return true;
  };

  lifetime.tabs = lifetime.tabs.filter(keepExpiration);
}

export async function createTab(sender: ExtensionMessage["sender"]) {
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

  return tab;
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

export async function createAcknowledgement(
  lifetime: Lifetime,
  sender: ExtensionMessage["sender"],
  timestamp: EpochMilliseconds,
) {
  const tab: Tab = await createTab(sender);
  const acknowledgement: Acknowledgement = lifetime.createAcknowledgement({ startTime: timestamp });
  const id: AcknowledgedTabIdentification = createAcknowledgementId(sender);

  const acknowledgedTab: AcknowledgedTab = { tab, acknowledgement, id };

  return acknowledgedTab;
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
    const acknowledgedTab = await createAcknowledgement(lifetime, sender, timestamp);

    addAcknowledgements(lifetime, acknowledgedTab);

    return acknowledgedTab.acknowledgement;
  };

  cleanup.push(onMessage("lifetime.acknowledge", acknowledgeHandler));

  cleanup.push(
    onMessage("lifetime.heartbeat", async ({ sender, timestamp }) => {
      const id = createAcknowledgementId(sender);
      const criteria: FindAcknowledgementArguments = { id };
      const acknowledgedTabs = findAcknowledgement(lifetime, criteria);
      if (acknowledgedTabs.length === 0) {
        return acknowledgeHandler({ sender, timestamp });
      } else {
        const acknowledgedTab = acknowledgedTabs[0];
        const patchedAcknowledgement = patchAcknowledgement(
          acknowledgedTab.acknowledgement,
          timestamp,
        );
        acknowledgedTab.acknowledgement = patchedAcknowledgement;
        return patchedAcknowledgement;
      }
    }),
  );

  return cleanup;
}
