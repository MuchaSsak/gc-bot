import {
  ChatInputCommandInteraction,
  Client,
  Collection,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

type Command = {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;

  execute: (interaction: ChatInputCommandInteraction) => any;
};
