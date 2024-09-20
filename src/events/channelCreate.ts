import { Events, TextChannel } from "discord.js";

import type { Event } from "@/typings/events.d.ts";
import { findGroupOperator, sendGroupAlert } from "@/lib/utils.ts";

const event: Event = {
  name: Events.ChannelCreate,

  async execute(channel: TextChannel) {
    try {
      const category = channel.parent;
      if (!category) return;

      // Check if the channel is in public category
      const operator = findGroupOperator(channel.guild!, category);
      if (!operator) return;

      await sendGroupAlert(
        channel.guild,
        category,
        `#${channel.name} has been created! 🔧`,
        "Blue",
        "The OP has created a new channel!"
      );
    } catch (err) {
      console.error(err);
    }
  },
};

export default event;
