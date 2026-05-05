import type { Browser } from "wxt/browser";

export type Milliseconds = number;
export type EpochMilliseconds = number;

/** Information about an acknowledgement and its contract for both parties.
 */
export interface Acknowledgement {
  heartbeat: {
    startTime: EpochMilliseconds;
    interval: Milliseconds;
    safeIntervalMultiplier: number;
    lastTime: EpochMilliseconds;
  };
}

/** Information that is unique about an AcknowledgedTab
 */
export interface AcknowledgedTabIdentification {
  tab: { id: Exclude<Browser.tabs.Tab["id"], undefined> };
  frame: { id: number };
}

export interface AcknowledgedTab {
  tab: Tab;
  acknowledgement: Acknowledgement;
  id: AcknowledgedTabIdentification;
}

/** Information about a tab.
 *
 * This structure outlines the information required for browser.tabs.sendMessage()
 * to send to a specific tabId and frameId
 * */
export interface Tab {
  /** The tab's loading status. */
  status?: Browser.tabs.Tab["status"];
  /** The ID of the tab. Tab IDs are unique within a browser session. Under some circumstances a tab may not be assigned an ID; for example, when querying foreign tabs using the {@link sessions} API, in which case a session ID may be present. Tab ID can also be set to `Browser.tabs.TAB_ID_NONE` for apps and devtools windows. */
  id: Exclude<Browser.tabs.Tab["id"], undefined>;
  /**
   * Whether the tab is discarded. A discarded tab is one whose content has been unloaded from memory, but is still visible in the tab strip. Its content is reloaded the next time it is activated.
   * @since Chrome 54
   */
  discarded: Browser.tabs.Tab["discarded"];

  /** A list of frames in the given tab, null if the specified tab ID is invalid. */
  frames: Frame[] | null;
}

export interface Frame {
  /** The ID of the frame. 0 indicates that this is the main frame; a positive value indicates the ID of a subframe. */
  frameId: number;
}
