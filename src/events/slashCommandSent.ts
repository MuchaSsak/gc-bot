import { Events, ChatInputCommandInteraction } from "discord.js";

import type { Event } from "@/typings/events.d.ts";
import type { Command } from "@/typings/commands.d.ts";

const event: Event = {
  name: Events.InteractionCreate,

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (!interaction.isChatInputCommand()) return;

      const command: Command = interaction.client.commands.get(
        interaction.commandName
      );
      if (!command)
        throw new Error(
          `No command matching ${interaction.commandName} was found!`
        );

      await command.execute(interaction);
    } catch (err) {
      console.error(err);
    }
  },
};

export default event;
