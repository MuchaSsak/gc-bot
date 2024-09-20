import {
  ChannelType,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CategoryChannel,
} from "discord.js";

import type { Command } from "@/typings/commands.d.ts";
import {
  findGroupOperator,
  sendGroupAlert,
  throwErrorWithReply,
} from "@/lib/utils.ts";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("leave-group")
    .setDescription("Leave a specified group.")
    .addChannelOption((option) =>
      option
        .setName("group")
        .setDescription("The group category which you wish to leave.")
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const category = interaction.options.getChannel(
        "group"
      )! as CategoryChannel;

      const operator = findGroupOperator(interaction.guild!, category);
      if (!operator)
        return throwErrorWithReply(
          interaction,
          "You must select a group, not a public category! ❌"
        );
      if (operator.id === interaction.user.id)
        return throwErrorWithReply(
          interaction,
          "You must not leave your own group! You can only delete it altogether. ❌"
        );

      // Remove user from group
      await category.permissionOverwrites.edit(interaction.user.id, {
        ViewChannel: false,
      });
      category.children.cache.forEach(
        async (channel) =>
          await channel.permissionOverwrites.edit(interaction.user.id, {
            ViewChannel: false,
          })
      );

      await sendGroupAlert(
        interaction.guild!,
        category,
        `**@${interaction.user.username}** has left the group! 🏃`,
        "Red"
      );

      await interaction.reply({
        content: "Successfully left the group! 🏃",
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
    }
  },
};

export default command;
