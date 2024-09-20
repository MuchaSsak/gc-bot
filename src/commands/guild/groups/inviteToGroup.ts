import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CategoryChannel,
  ChannelType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";

import type { Command } from "@/typings/commands.d.ts";
import { getInvitationEmbed } from "@/lib/embeds.ts";
import {
  findGroupAlertsChannel,
  findGroupOperator,
  sendGroupAlert,
  throwErrorWithReply,
} from "@/lib/utils.ts";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("invite-to-group")
    .setDescription("Invite a user to your group.")
    .addChannelOption((option) =>
      option
        .setName("group")
        .setDescription("The group category to invite the user in.")
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to invite.")
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const category = interaction.options.getChannel(
        "group"
      )! as CategoryChannel;
      const invitedUser = interaction.options.getUser("user")!;

      const operator = findGroupOperator(interaction.guild!, category);
      if (!operator)
        return throwErrorWithReply(
          interaction,
          "You must select a group, not a public category! ❌"
        );
      if (category.members.has(invitedUser.id))
        return throwErrorWithReply(
          interaction,
          "This user is already in the group! ❌"
        );

      // Button components
      const accept = new ButtonBuilder()
        .setCustomId("accept")
        .setLabel("Accept")
        .setStyle(ButtonStyle.Primary);
      const reject = new ButtonBuilder()
        .setCustomId("reject")
        .setLabel("Reject")
        .setStyle(ButtonStyle.Danger);
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        accept,
        reject
      );

      const message = await invitedUser.send({
        embeds: [getInvitationEmbed(category, operator)],
        components: [row],
      });

      await interaction.reply({
        content: "Your invitation has been sent! ✉️",
        ephemeral: true,
      });

      // Handle the invited user's response
      const confirmation = await message.awaitMessageComponent({
        filter: (i) => i.user.id === invitedUser.id,
        time: 60 * 1000 * 60 * 72, // 3 days
      });
      if (confirmation.customId === "accept") {
        // Add user to group
        await category.permissionOverwrites.edit(invitedUser.id, {
          ViewChannel: true,
        });
        const alertsChannel = findGroupAlertsChannel(category, operator)!;
        await alertsChannel.permissionOverwrites.edit(invitedUser.id, {
          SendMessages: false,
        });
        category.children.cache.forEach(
          async (channel) =>
            await channel.permissionOverwrites.edit(invitedUser.id, {
              ViewChannel: true,
            })
        );
        await sendGroupAlert(
          interaction.guild!,
          category,
          `@${invitedUser.username} has joined the group! 👋`,
          "Green",
          `Invited by @${interaction.user.username}`
        );

        await message.edit({ components: [] });
        await message.react("🟢");
        await confirmation.reply({
          content: "Successfully joined the group! 💌",
          ephemeral: true,
        });
      }
      if (confirmation.customId === "reject") {
        await message.edit({ components: [] });
        await message.react("🔴");
        await confirmation.reply({
          content: "Rejected the invitation! 🗑️",
          ephemeral: true,
        });
      }
    } catch (err) {
      console.error(err);
    }
  },
};

export default command;
