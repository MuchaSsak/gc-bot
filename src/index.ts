import { Client, GatewayIntentBits } from "discord.js";
import express from "express";

import { env } from "@/lib/config.ts";
import registerEvents from "@/register/registerEvents.ts";
import registerCommands from "@/register/registerCommands.ts";

export const client = new Client({
  // Add all intents
  intents: [
    Object.keys(GatewayIntentBits).map((a: string) => {
      return GatewayIntentBits[a as keyof typeof GatewayIntentBits];
    }),
  ],
});

(async () => {
  await Promise.all([registerEvents(), registerCommands()]);

  await client.login(env.DISCORD_TOKEN);
})();

// Server listening on a port to avoid the Render's web service server from shutting down automatically
const app = express();
const port = 3000;
app.get("/", (req, res) => {
  res.send("Pong!");
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
