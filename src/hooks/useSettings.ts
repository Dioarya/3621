import { createSettingsStore, createSettingsStoreReadyPromise } from "@/utils/store";

export const usePopupSettings = createSettingsStore();
void createSettingsStoreReadyPromise(usePopupSettings); // fire and forget
