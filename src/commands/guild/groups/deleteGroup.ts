import { findGroupOperator, throwErrorWithReply } from "@/lib/utils.ts";
import type { Command } from "@/typings/commands.d.ts";
import { CategoryChannel, ChannelType, SlashCommandBuilder } from "discord.js";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("delete-group")
    .setDescription("Delete your group entirely - Must be OP!")
    .addChannelOption((option) =>
      option
        .setName("group")
        .setDescription("The group category to delete.")
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
    ),

  async execute(interaction) {
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
      if (operator.id !== interaction.user.id)
        return throwErrorWithReply(
          interaction,
          "You are not this group's operator! ❌"
        );

      // Delete group if all is valid
      category.children.cache.forEach(
        async (channel) => await channel.delete()
      );
      await category.delete();

      await interaction.reply({
        content: "Your group has been deleted! 🗑️",
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
    }
  },
};

export default command;
