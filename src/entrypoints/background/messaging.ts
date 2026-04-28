import { RemoveListenerCallback } from "@webext-core/messaging";

async function getAllSettings(): Promise<Settings> {
  const entries = Object.entries(storageItems) as [keyof Settings, any][];
  const resolvedEntries = await Promise.all(
    entries.map(async ([key, item]) => [key, await item.getValue()] as const),
  );
  return Object.fromEntries(resolvedEntries) as Settings;
}

function createGetAndSet<T extends keyof Settings>(
  prop: T,
  options: { get?: true; set: false },
): { get: RemoveListenerCallback };
function createGetAndSet<T extends keyof Settings>(
  prop: T,
  options: { get: false; set?: true },
): { set: RemoveListenerCallback };
function createGetAndSet<T extends keyof Settings>(
  prop: T,
  options: { get?: true; set?: true },
): { get: RemoveListenerCallback; set: RemoveListenerCallback };
function createGetAndSet<T extends keyof Settings>(
  prop: T,
): { get: RemoveListenerCallback; set: RemoveListenerCallback };
function createGetAndSet<T extends keyof Settings>(
  prop: T,
  options?: { get?: boolean; set?: boolean },
): { get?: RemoveListenerCallback; set?: RemoveListenerCallback } {
  const get = options?.get ?? true;
  const set = options?.set ?? true;

  const result: { get?: RemoveListenerCallback; set?: RemoveListenerCallback } = {};

  if (get) {
    const getterMessage = `${prop}.get` as keyof ProtocolMap;
    result.get = onMessage(getterMessage, async () => {
      return storageItems[prop].getValue();
    });
  }

  if (set) {
    const setterMessage = `${prop}.set` as keyof ProtocolMap;
    result.set = onMessage(setterMessage, async ({ data }) => {
      await storageItems[prop].setValue(data as any);
    });
  }

  return result;
}

export function setupMessaging(): RemoveListenerCallback[] {
  const cleanup: RemoveListenerCallback[] = [];

  cleanup.push(
    onMessage("settings.get", async () => {
      return getAllSettings();
    }),
  );

  const props = Object.keys(new Settings()) as (keyof Settings)[];
  for (const prop of props) {
    cleanup.push(...Object.values(createGetAndSet(prop)));
  }

  return cleanup;
}
