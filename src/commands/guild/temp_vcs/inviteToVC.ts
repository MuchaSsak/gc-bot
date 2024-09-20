import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  VoiceChannel,
} from "discord.js";

import { Command } from "@/typings/commands.js";
import {
  findGroupOperator,
  findGuildChannel,
  findGuildMember,
  throwErrorWithReply,
} from "@/lib/utils.ts";
import { TEMPORARY_VCS_CATEGORY_ID } from "@/lib/constants.ts";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("invite-to-vc")
    .setDescription("Invite a user to your private temporary VC.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to invite.")
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      // Check if user is in VC
      const member = (await findGuildMember(
        interaction.guild!,
        interaction.user.id
      ))!;
      if (!member.voice.channelId)
        return throwErrorWithReply(
          interaction,
          "You must be in a temporary VC to use this command! ❌"
        );

      // Check if user is in a temporary VC
      const channel = (await findGuildChannel(
        interaction.guild!,
        member.voice.channelId
      )!) as VoiceChannel;
      const category = channel.parent;
      if (category?.id !== TEMPORARY_VCS_CATEGORY_ID)
        return throwErrorWithReply(
          interaction,
          "You must be in a temporary VC to use this command! ❌"
        );

      // Check if user is the VC operator
      const isVcOperator = channel
        .permissionsFor(interaction.user.id)
        ?.has("DeafenMembers");
      if (!isVcOperator)
        return throwErrorWithReply(
          interaction,
          "You must be this VC's operator! ❌"
        );

      // Check if user invited a valid member
      const invitedUser = interaction.options.getUser("user")!;
      if (invitedUser.bot || interaction.guild!.ownerId === invitedUser.id)
        return throwErrorWithReply(
          interaction,
          "You musn't invite those users! ❌"
        );
      if (invitedUser.id === interaction.user.id)
        return throwErrorWithReply(
          interaction,
          "You musn't invite yourself! ❌"
        );

      // Add the user to the VC
      await channel.permissionOverwrites.edit(invitedUser.id, {
        ViewChannel: true,
      });

      await interaction.reply({
        content: "This user can now join your channel! 📩",
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
    }
  },
};

export default command;
