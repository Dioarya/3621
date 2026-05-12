import type { ContentScriptContext } from "wxt/utils/content-script-context";

import type { Acknowledgement } from "@/utils/lifetime";

import { sendMessage } from "@/utils/messaging";

function scheduleHeartbeat(ctx: ContentScriptContext, acknowledgement: Acknowledgement) {
  const { interval, safeIntervalMultiplier } = acknowledgement.heartbeat;
  const safeInterval = interval * safeIntervalMultiplier;

  if (import.meta.env.DEV)
    console.log(`[content:lifetime] log: heartbeat scheduled in ${safeInterval}ms`);

  return setTimeout(async () => {
    if (!ctx.isValid) return;

    const updatedAcknowledgement = await sendMessage("lifetime.heartbeat");
    if (import.meta.env.DEV)
      console.log(
        `[content:lifetime] log: heartbeat sent, lastTime=${updatedAcknowledgement.heartbeat.lastTime}`,
      );
    scheduleHeartbeat(ctx, updatedAcknowledgement);
  }, safeInterval);
}

export async function setupLifetime(ctx: ContentScriptContext) {
  const acknowledgement = await sendMessage("lifetime.acknowledge");

  if (import.meta.env.DEV) {
    console.log(
      `[content:lifetime] log: acknowledged: interval=${acknowledgement.heartbeat.interval}ms safeMultiplier=${acknowledgement.heartbeat.safeIntervalMultiplier}`,
    );
  }

  let timeoutId = scheduleHeartbeat(ctx, acknowledgement);

  return () => {
    if (import.meta.env.DEV) console.log("[content:lifetime] log: lifetime torn down");
    clearTimeout(timeoutId);
  };
}
