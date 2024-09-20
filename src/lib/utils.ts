import {
  CategoryChannel,
  ChatInputCommandInteraction,
  ColorResolvable,
  EmbedBuilder,
  Guild,
  GuildMember,
  TextChannel,
} from "discord.js";
import fs from "node:fs";
import path from "node:path";

import type { Command } from "@/typings/commands.d.ts";

export const findGuildMember = async (guild: Guild, memberId: string) =>
  (await guild.members.fetch()).find((member) => member.id === memberId);

export const findGuildChannel = async (guild: Guild, channelId: string) =>
  (await guild.channels.fetch()).find((channel) => channel?.id === channelId);

export const findSocialProfile = async (
  profilesChannel: TextChannel,
  userId: string
) =>
  (await profilesChannel.messages.fetch()).find((message) =>
    message.content.includes(userId)
  );

export const findGroupAlertsChannel = (
  category: CategoryChannel,
  operator: GuildMember
) =>
  category.children.cache.find((channel) =>
    operator.permissionsIn(channel).missing("SendMessages")
  );

// The operator must not be either GC Bot or GC Admin (owner)
// Those members will always have the ManageChannels permission, however they won't operate any groups.
export const findGroupOperator = (guild: Guild, category: CategoryChannel) =>
  category.members.find(
    (member) =>
      member.permissionsIn(category).has("ManageChannels") &&
      !member.user.bot &&
      guild.ownerId !== member.id
  );

export async function throwErrorWithReply(
  interaction: ChatInputCommandInteraction,
  errorMessage: string
) {
  try {
    await interaction.reply({ content: errorMessage, ephemeral: true });
  } catch (err) {
    console.error(err);
  } finally {
    throw new Error(errorMessage);
  }
}

export async function sendGroupAlert(
  guild: Guild,
  category: CategoryChannel,
  title: string,
  color: ColorResolvable,
  footer?: string
) {
  const operator = findGroupOperator(guild, category)!;
  const alertsChannel = findGroupAlertsChannel(
    category,
    operator
  ) as TextChannel;

  const message = new EmbedBuilder()
    .setTitle(title)
    .setFooter(footer ? { text: footer } : null)
    .setColor(color);
  await alertsChannel.send({ embeds: [message] });
}

export async function getCommands(foldersPath: string): Promise<Command[]> {
  const commands: Command[] = [];
  const commandFolders = fs.readdirSync(foldersPath);

  // Read all folders
  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".ts"));

    // Read all command files inside those folders
    for (const file of commandFiles) {
      const filePath = `file://${path.join(commandsPath, file)}`;
      const { default: command }: { default: Command } = await import(filePath);

      commands.push(command);
    }
  }

  return commands;
}
