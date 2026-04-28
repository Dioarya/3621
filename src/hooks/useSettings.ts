import { createSettingsStore, createSettingsStoreReadyPromise } from "@/utils/store";

export const usePopupSettings = createSettingsStore();
createSettingsStoreReadyPromise(usePopupSettings); // fire and forget
