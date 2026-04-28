import { create } from "zustand";

interface SettingsStore extends Settings {
  ready: boolean;
}

export const useSettingsStore = create<SettingsStore>(() => ({
  ...new Settings(),
  ready: false,
}));

export async function initSettingsStore() {
  const settings = await sendMessage("settings.get");
  useSettingsStore.setState({ ...settings, ready: true });
}
