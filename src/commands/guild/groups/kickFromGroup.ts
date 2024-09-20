import { CategoryChannel, ChannelType, SlashCommandBuilder } from "discord.js";

import {
  findGroupOperator,
  sendGroupAlert,
  throwErrorWithReply,
} from "@/lib/utils.ts";
import { Command } from "@/typings/commands.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("kick-from-group")
    .setDescription("Kick a user from your group - Must be OP!")
    .addChannelOption((option) =>
      option
        .setName("group")
        .setDescription(
          "The group category from which you want to kick the user."
        )
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to kick from the group.")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const member = interaction.options.getUser("user")!;
      const category = interaction.options.getChannel(
        "group"
      ) as CategoryChannel;

      const operator = findGroupOperator(interaction.guild!, category);
      if (!operator)
        return throwErrorWithReply(
          interaction,
          "You must select a group, not a public category! ❌"
        );
      if (operator.id !== interaction.user.id)
        return throwErrorWithReply(
          interaction,
          "You are not this group's operator! ❌"
        );

      // Kick user from group
      await category.permissionOverwrites.edit(member.id, {
        ViewChannel: false,
      });
      category.children.cache.forEach(
        async (channel) =>
          await channel.permissionOverwrites.edit(member.id, {
            ViewChannel: false,
          })
      );

      await sendGroupAlert(
        interaction.guild!,
        category,
        `@${member.username} has been kicked from the group! 🔨`,
        "DarkRed",
        `Kicked by @${interaction.user.username}`
      );

      await interaction.reply({
        content: "Successfully kicked the user! 🔨",
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
    }
  },
};

export default command;
