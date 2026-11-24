import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { createConsoleUI } from "../shared/logger/console-ui.ts";
import {
  CHECK_ALL_STEPS,
  checkAllFresh,
  readCheckAllCache,
  runCheckAll,
  writeCheckAllCache,
} from "./resume.ts";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const cacheFile = join(repoRoot, "node_modules/.cache/mezatonline/check-all.json");

const log = createConsoleUI("check:all");

const code = runCheckAll({
  cache: readCheckAllCache(cacheFile),
  fresh: checkAllFresh(process.argv.slice(2)),
  log,
  onCache: (cache) => writeCheckAllCache(cacheFile, cache),
  run: (script) => {
    if (script === "check:links") {
      const result = spawnSync("node", ["tools/cli/links/cli.ts", "--no-external"], {
        cwd: repoRoot,
        stdio: "inherit",
      });
      return result.status ?? 1;
    }
    const result = spawnSync("pnpm", ["run", script], {
      cwd: repoRoot,
      stdio: "inherit",
    });
    return result.status ?? 1;
  },
  steps: CHECK_ALL_STEPS,
});

process.exitCode = code;
