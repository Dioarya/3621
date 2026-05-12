import type { GetReturnType } from "@webext-core/messaging";

import { type ProtocolMap, sendMessage } from "@/utils/messaging";
import { Settings } from "@/utils/settings";
import { createSettingsStore, fetchSettingsStore } from "@/utils/store";

export const usePopupSettings = createSettingsStore();
void fetchSettingsStore(usePopupSettings); // fire and forget

type MessageInput<K extends keyof ProtocolMap> = Parameters<typeof sendMessage<K>>[1];

export function useSettingsControls() {
  const createControl = <K extends keyof Settings>(prop: K) => {
    type SetKey = `${K}.set`;
    type SetValue = MessageInput<SetKey>;
    type SetReturn = GetReturnType<ProtocolMap[SetKey]>;

    const value = usePopupSettings((state) => state[prop]);
    const update = async (value: SetValue) => {
      if (import.meta.env.DEV)
        console.log(`[popup:settings] log: setting update sent: ${prop}=`, value);
      return await sendMessage(`${prop}.set`, value);
    };

    return { value, update } as const satisfies {
      value: Settings[K];
      update: (value: SetValue) => Promise<SetReturn>;
    };
  };

  const keys = Object.keys(new Settings()) as (keyof Settings)[];

  return Object.fromEntries(keys.map((key) => [key, createControl(key)])) as {
    [K in keyof Settings]: ReturnType<typeof createControl<K>>;
  };
}
