import { Events } from "discord.js";

type Event = {
  name: Events;
  once?: boolean;

  execute: (...args) => any;
};
