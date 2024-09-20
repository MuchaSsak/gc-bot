import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel,
} from "discord.js";

import type { Command } from "@/typings/commands.d.ts";
import { findGuildChannel, findSocialProfile } from "@/lib/utils.ts";
import { SOCIAL_PROFILES_CHANNEL_ID } from "@/lib/constants.ts";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("create-profile")
    .setDescription(
      "Introduce yourself in your own custom profile that will be displayed in the social profiles channel."
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Write a description of yourself.")
        .setRequired(true)
        .setMinLength(5)
        .setMaxLength(1000)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const description = interaction.options.getString("description")!;

      const message = new EmbedBuilder()
        .setTitle(interaction.user.displayName)
        .setAuthor({ name: interaction.user.username })
        .setThumbnail(interaction.user.avatarURL())
        .setDescription(description)
        .setColor("Random");

      const profilesChannel = (await findGuildChannel(
        interaction.guild!,
        SOCIAL_PROFILES_CHANNEL_ID
      )) as TextChannel;

      // Delete this user's previous profile
      const previousProfile = await findSocialProfile(
        profilesChannel,
        interaction.user.id
      );
      if (previousProfile) await previousProfile.delete();

      await profilesChannel.send({
        embeds: [message],
        content: `<@${interaction.user.id}>`,
      });

      await interaction.reply({
        content: "Your profile has been created! 👥",
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
    }
  },
};

export default command;
