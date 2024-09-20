import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  TextChannel,
} from "discord.js";

import type { Command } from "@/typings/commands.d.ts";
import {
  findGuildChannel,
  findSocialProfile,
  throwErrorWithReply,
} from "@/lib/utils.ts";
import { SOCIAL_PROFILES_CHANNEL_ID } from "@/lib/constants.ts";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("delete-profile")
    .setDescription("Deletes your profile in the social profiles channel."),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const profilesChannel = (await findGuildChannel(
        interaction.guild!,
        SOCIAL_PROFILES_CHANNEL_ID
      )) as TextChannel;
      const profile = await findSocialProfile(
        profilesChannel,
        interaction.user.id
      );

      if (!profile)
        return throwErrorWithReply(
          interaction,
          "You don't have a social profile! ❌"
        );

      await profile.delete();

      await interaction.reply({
        content: "Successfully deleted your social profile! 🗑️",
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
    }
  },
};

export default command;
