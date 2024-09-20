import { ClientEvents } from "discord.js";
import fs from "node:fs";
import path from "node:path";

import { client } from "@/index.ts";
import type { Event } from "@/typings/events.d.ts";

async function registerEvents() {
  // Get all typescript event files
  const eventsPath = path.join(path.resolve(), "src", "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".ts"));

  for (const file of eventFiles) {
    // Get an individual event file
    const filePath = `file://${path.join(eventsPath, file)}`;
    const { default: event }: { default: Event } = await import(filePath);

    // Register the event to the Discord client
    if (event.once)
      client.once(event.name as keyof ClientEvents, event.execute);
    else client.on(event.name as keyof ClientEvents, event.execute);
  }
}

export default registerEvents;
