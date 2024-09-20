import dotenv from "dotenv";

// Init environment variables
dotenv.config();
const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID)
  throw new Error("Missing environment variables!");

export const env = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
};
