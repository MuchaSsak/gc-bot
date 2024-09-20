import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import path from "node:path";

import type { Command } from "@/typings/commands.d.ts";
import { getCommands } from "@/lib/utils.ts";
import { getHelpEmbed } from "@/lib/embeds.ts";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Lists all commands."),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const globalCommands = await getCommands(
        path.join(path.resolve(), "src", "commands", "global")
      );
      const guildCommands = await getCommands(
        path.join(path.resolve(), "src", "commands", "guild")
      );

      await interaction.reply({
        embeds: [getHelpEmbed(globalCommands, guildCommands)],
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
    }
  },
};

export default command;
