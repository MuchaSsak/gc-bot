import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ChannelType,
  PermissionFlagsBits,
  TextChannel,
  EmbedBuilder,
} from "discord.js";

import type { Command } from "@/typings/commands.d.ts";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("send-embed")
    .setDescription(
      "Send an embedded message to a specified channel - Must be ADMIN!"
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel in which to send the message.")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("embed")
        .setDescription("The embed message object formatted in JSON.")
    )
    .addAttachmentOption((option) =>
      option
        .setName("attachment")
        .setDescription("File attached to the message.")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const channel = interaction.options.getChannel("channel")! as TextChannel;
      const embed = interaction.options.getString("embed")!;
      const attachment = interaction.options.getAttachment("attachment");

      const message = new EmbedBuilder(JSON.parse(embed));

      await channel.send({
        embeds: [message],
        files: attachment ? [{ attachment: attachment.url }] : undefined,
      });

      await interaction.reply({
        content: "Your embedded message has been sent! 💬",
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
    }
  },
};

export default command;
