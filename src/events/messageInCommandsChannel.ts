import { Events, Message, MessageType } from "discord.js";

import type { Event } from "@/typings/events.d.ts";
import { COMMANDS_CHANNEL_ID } from "@/lib/constants.ts";

const event: Event = {
  name: Events.MessageCreate,

  async execute(interaction: Message) {
    try {
      const isCommandsChannel = interaction.channelId === COMMANDS_CHANNEL_ID;
      if (
        !isCommandsChannel ||
        interaction.type === MessageType.ChatInputCommand
      )
        return;

      await interaction.delete();
    } catch (err) {
      console.error(err);
    }
  },
};

export default event;
