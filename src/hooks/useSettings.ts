import type { GetReturnType } from "@webext-core/messaging";

import type { MultiKey, MultiValue } from "@/utils/multi";

import { type ProtocolMap, sendMessage } from "@/utils/messaging";
import { mapMulti, traverse } from "@/utils/multi";
import { Settings } from "@/utils/settings";
import { createSettingsStore } from "@/utils/store";

export const usePopupSettings = createSettingsStore();

type MessageInput<K extends keyof ProtocolMap> = Parameters<typeof sendMessage<K>>[1];

type SetProtocolKey<K extends string> = Extract<`${K}.set`, keyof ProtocolMap>;

type Control<Root extends object, K extends MultiKey<Root> & string> = {
  value: MultiValue<Root, K>;
  update: (
    value: MessageInput<SetProtocolKey<K>>,
  ) => Promise<GetReturnType<ProtocolMap[SetProtocolKey<K>]>>;
};

type Controls<T extends object, Root extends object = T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends object
    ? Controls<T[K], Root, `${Prefix}${K}.`>
    : Control<Root, Extract<MultiKey<Root> & string, `${Prefix}${K}`>>;
};

export function useSettingsControls(): Controls<Settings> {
  const createControl = <K extends MultiKey<Settings>>(prop: K) => {
    type SetKey = SetProtocolKey<K>;
    type GetValue = MultiValue<Settings, K>;
    type SetValue = MessageInput<SetKey>;

    const value = usePopupSettings((state) => {
      const settings = state.data ?? new Settings();
      return traverse(settings, prop);
    }) as GetValue;

    const update = async (value: SetValue) => {
      if (import.meta.env.DEV) {
        console.log(`[popup:settings] log: setting update sent: ${prop}=`, value);
      }

      return await sendMessage(`${prop}.set`, value);
    };

    return { value, update } as const satisfies Control<Settings, K>;
  };

  return mapMulti(new Settings(), (prop) =>
    createControl(prop as MultiKey<Settings>),
  ) as Controls<Settings>;
}
