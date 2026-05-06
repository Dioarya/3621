import type { ContentScriptContext } from "wxt/utils/content-script-context";

import type { Acknowledgement } from "@/utils/lifetime";

import { sendMessage } from "@/utils/messaging";

function scheduleHeartbeat(ctx: ContentScriptContext, acknowledgement: Acknowledgement) {
  const { interval, safeIntervalMultiplier } = acknowledgement.heartbeat;
  const safeInterval = interval * safeIntervalMultiplier;

  return setTimeout(async () => {
    if (!ctx.isValid) return;

    const updatedAcknowledgement = await sendMessage("lifetime.heartbeat");
    scheduleHeartbeat(ctx, updatedAcknowledgement);
  }, safeInterval);
}

export async function setupLifetime(ctx: ContentScriptContext) {
  const acknowledgement = await sendMessage("lifetime.acknowledge");

  let timeoutId = scheduleHeartbeat(ctx, acknowledgement);

  return () => clearTimeout(timeoutId);
}
