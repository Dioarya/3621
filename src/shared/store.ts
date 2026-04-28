import { create } from "zustand";

interface SettingsStore extends Settings {
  ready: boolean;
  error: Error | null;
}

// to be called inside popup and content-script
export function createSettingsStore() {
  const store = create<SettingsStore>(() => ({
    ...new Settings(),
    ready: false,
    error: null,
  }));

  // listen for background broadcasts
  onMessage("settings.update", ({ data }) => {
    store.setState(data);
  });

  // fetch initial state from background
  sendMessage("settings.get", undefined)
    .then((settings) => store.setState({ ...settings, ready: true }))
    .catch((e) => store.setState({ error: e as Error }));

  return store;
}
