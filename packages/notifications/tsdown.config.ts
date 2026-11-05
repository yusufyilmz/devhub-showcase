import { defineLibraryConfig } from "@shared/cli/tsdown";

export default defineLibraryConfig({
  entry: ["src/index.ts", "src/client.ts", "src/websocket.ts", "src/server.ts", "src/worker.ts"],
  platform: "node",
});
