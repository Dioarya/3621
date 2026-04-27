export function setupMessaging() {
  onMessage("settings.get", async () => {
    const [theme, align, verticalConstraint, liveUpdate] = await Promise.all([
      storageItems.theme.getValue(),
      storageItems.align.getValue(),
      storageItems.verticalConstraint.getValue(),
      storageItems.liveUpdate.getValue(),
    ]);
    return { theme, align, verticalConstraint, liveUpdate } satisfies Settings;
  });

  onMessage("theme.get", async () => {
    return storageItems.theme.getValue();
  });

  onMessage("theme.set", async ({ data }) => {
    await storageItems.theme.setValue(data);
  });

  onMessage("align.set", async ({ data }) => {
    await storageItems.align.setValue(data);

    const tabs = await browser.tabs.query({ url: "*://*.e621.net/*" });
    for (const tab of tabs) {
      if (tab.id) {
        browser.tabs.sendMessage(tab.id, { type: "alignChanged", data });
      }
    }
  });
}
