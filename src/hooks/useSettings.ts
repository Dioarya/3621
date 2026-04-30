import { createSettingsStore, fetchSettingsStore } from "@/utils/store";

export const usePopupSettings = createSettingsStore();
void fetchSettingsStore(usePopupSettings); // fire and forget
