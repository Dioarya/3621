import type { AcknowledgedTab, Milliseconds, EpochMilliseconds } from "@/utils/lifetime";

import { Mutex } from "@/utils/mutex";

export class TabManager {
  private tabs: AcknowledgedTab[];
  public mutex: Mutex;

  async use<T>(callback: (tabs: AcknowledgedTab[]) => T): Promise<T> {
    return this.mutex.runExclusive(async () => callback(this.tabs));
  }

  async push(tab: AcknowledgedTab) {
    return this.mutex.runExclusive(async () => this.tabs.push(tab));
  }

  async acquire() {
    return [await this.mutex.acquire(), this.tabs] as const;
  }

  async set(callback: (oldValue: AcknowledgedTab[]) => AcknowledgedTab[]): Promise<void>;
  async set(tabs: AcknowledgedTab[] | ((oldValue: AcknowledgedTab[]) => AcknowledgedTab[])) {
    const release = await this.mutex.acquire();

    let newValue;
    if (typeof tabs === "function") newValue = tabs(this.tabs);
    else newValue = tabs;

    if (import.meta.env.DEV)
      console.log(
        `[background:lifetime] log: TabManager.set - ${this.tabs.length} tab(s) -> ${newValue.length} tab(s)`,
      );

    this.tabs.splice(0, this.tabs.length, ...newValue);
    release();
  }

  constructor(tabs?: AcknowledgedTab[]) {
    this.tabs = tabs ?? [];
    this.mutex = new Mutex();
  }
}

type LifetimeArguments = {
  heartbeat: Lifetime["heartbeat"];
};

type LifetimeCreateAcknowledgementArguments = {
  startTime: EpochMilliseconds;
};

export class Lifetime {
  tabs: TabManager;
  heartbeat: {
    interval: Milliseconds;
    safeIntervalMultiplier: number;
  };

  constructor(args: LifetimeArguments) {
    this.tabs = new TabManager();
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
