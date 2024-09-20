import { Events, Client } from "discord.js";

import type { Event } from "@/typings/events.d.ts";
import { BOT_ACTIVITY_STATUS, BOT_ACTIVITY_TYPE } from "@/lib/constants.ts";

const event: Event = {
  name: Events.ClientReady,
  once: true,

  execute(client: Client) {
    console.log("GC Bot is now online!");

    // Set the bot's activity status
    client.user!.setActivity(BOT_ACTIVITY_STATUS, {
      type: BOT_ACTIVITY_TYPE,
    });
  },
};

export default event;
