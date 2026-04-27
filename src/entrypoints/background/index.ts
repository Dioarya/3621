import { setupMessaging } from "./messaging";

export default defineBackground({
  persistent: true,
  main() {
    setupMessaging();
  },
});
