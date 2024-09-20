import { Collection } from "discord.js";

import type { Command } from "@/typings/commands.d.ts";

declare module "discord.js" {
  export interface Client {
    commands: Collection<Command[]>;
  }
}
