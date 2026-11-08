#!/usr/bin/env node
import { Command } from "commander";

import { makeLookupCommands } from "./commands.ts";

const program = new Command("lookup").description(
  "Read-only, token-bounded lookup of repository catalogs, skills, docs and design",
);
for (const command of makeLookupCommands()) program.addCommand(command);
program.parse();
