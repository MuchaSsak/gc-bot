import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

import type { Command } from "@/typings/commands.d.ts";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong."),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      await interaction.reply({ content: "Pong!", ephemeral: true });
    } catch (err) {
      console.error(err);
    }
  },
};

export default command;
