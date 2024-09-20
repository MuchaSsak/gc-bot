import {
  ChannelType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

import type { Command } from "@/typings/commands.d.ts";
import { findGuildMember } from "@/lib/utils.ts";
import { getGroupAlertsWelcomeEmbed } from "@/lib/embeds.ts";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("create-group")
    .setDescription(
      "Create your own seperate community and manage it yourself."
    )
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of your group.")
        .setMinLength(3)
        .setMaxLength(30)
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const name = interaction.options.getString("name")!;
      const operator = (await findGuildMember(
        interaction.guild!,
        interaction.user.id
      ))!; // The creator of a group is its operator
      const everyone = interaction.guild!.roles.everyone;

      // Create category
      const category = await interaction.guild!.channels.create({
        name,
        type: ChannelType.GuildCategory,
        nsfw: true,
        permissionOverwrites: [
          {
            id: operator.id,
            allow: ["ManageChannels", "ViewChannel"],
          },
          {
            id: everyone.id,
            deny: ["ViewChannel"],
          },
        ],
      });

      // Create channels
      const alertsChannel = await interaction.guild!.channels.create({
        name: "alerts",
        type: ChannelType.GuildText,
        parent: category,
        permissionOverwrites: [
          {
            id: operator.id,
            deny: ["ManageChannels", "SendMessages"],
            allow: ["ViewChannel"],
          },
          {
            id: everyone.id,
            deny: ["ViewChannel"],
          },
        ],
      });
      await interaction.guild!.channels.create({
        name: "chat",
        type: ChannelType.GuildText,
        parent: category,
        nsfw: true,
        permissionOverwrites: [
          {
            id: operator.id,
            deny: ["ManageChannels"],
            allow: ["ViewChannel"],
          },
          {
            id: everyone.id,
            deny: ["ViewChannel"],
          },
        ],
      });
      await interaction.guild!.channels.create({
        name: "VC",
        type: ChannelType.GuildVoice,
        parent: category,
        nsfw: true,
        permissionOverwrites: [
          {
            id: operator.id,
            deny: ["ManageChannels"],
            allow: ["ViewChannel"],
          },
          {
            id: everyone.id,
            deny: ["ViewChannel"],
          },
        ],
      });

      // Send welcome embed to alerts channel
      const welcomeMessage = await alertsChannel.send({
        embeds: [getGroupAlertsWelcomeEmbed(category, operator)],
      });
      await welcomeMessage.pin();

      await interaction.reply({
        content: "Your group has been created! 🔊",
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
    }
  },
};

export default command;
