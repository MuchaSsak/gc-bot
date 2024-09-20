import { Collection, REST, Routes } from "discord.js";
import path from "node:path";

import { env } from "@/lib/config.ts";
import { GUILD_ID } from "@/lib/constants.ts";
import { getCommands } from "@/lib/utils.ts";
import { client } from "@/index.ts";

async function registerCommands() {
  try {
    const globalCommands = await getCommands(
      path.join(path.resolve(), "src", "commands", "global")
    );
    const guildCommands = await getCommands(
      path.join(path.resolve(), "src", "commands", "guild")
    );

    // Add all commands to a property on the client
    const allCommands = [...globalCommands, ...guildCommands];
    client.commands = new Collection();
    allCommands.forEach((command) =>
      client.commands.set(command.data.name, command)
    );

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(env.DISCORD_TOKEN);

    // Register global commands (can be used anywhere)
    await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), {
      body: globalCommands.map((command) => command.data),
    });
    console.log(
      `Successfully reloaded ${globalCommands.length} application (/) commands!`
    );

    // Register guild only commands
    await rest.put(
      Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, GUILD_ID),
      {
        body: guildCommands.map((command) => command.data),
      }
    );
    console.log(
      `Successfully reloaded ${guildCommands.length} application guild (/) commands!`
    );
  } catch (err) {
    console.error(err);
  }
}

export default registerCommands;
