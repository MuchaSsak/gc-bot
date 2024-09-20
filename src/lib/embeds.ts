import { CategoryChannel, EmbedBuilder, GuildMember } from "discord.js";

import type { Command } from "@/typings/commands.d.ts";
import { DEVELOPER_USERNAME } from "@/lib/constants.ts";

const helpFooter = `If you need any help related this server or bot, please read the informations channel in the public GroupChat category or use the \`/help\` command. In case of experiencing technical issues, you may also contact the bot developer @${DEVELOPER_USERNAME} 🛠️`;

export function getHelpEmbed(
  globalCommands: Command[],
  guildCommands: Command[]
) {
  return new EmbedBuilder()
    .setTitle("GC Bot | Help ⚙️")
    .setColor("Aqua")
    .addFields([
      {
        name: "🌏 Global Commands (can be used anywhere):",
        value: globalCommands
          .map(
            (command) =>
              `- **/${command.data.name}**: ${command.data.description}`
          )
          .join("\n"),
      },
      {
        name: "💬 Guild Commands (GroupChat only):",
        value: guildCommands
          .map(
            (command) =>
              `- **/${command.data.name}**: ${command.data.description}`
          )
          .join("\n"),
      },
    ]);
}

export function getGroupAlertsWelcomeEmbed(
  category: CategoryChannel,
  operator: GuildMember
) {
  return new EmbedBuilder()
    .setTitle(`Welcome to ${category.name}! 🥳`)
    .setDescription(
      `
     **@${operator.user.username}** is this group's operator. ⚙️
     
     Actions done by the OP such as inviting or kicking members of this group will be logged right here. Nobody can type in here so the logs are easily accessible. 🙂

     Remember that all groups are **__unmoderated__**, so viewer discretion is advised. ⚠️

     Assuming that everything is alright and understood, enjoy your stay here! ❤️ 
    `
    )
    .setColor("Yellow")
    .setFooter({
      text: helpFooter,
    });
}

export function getInvitationEmbed(
  category: CategoryChannel,
  operator: GuildMember
) {
  return new EmbedBuilder()
    .setTitle(`You've been invited to ${category.name}! ✉️`)
    .setDescription(
      `
      **@${operator.user.username}** has invited you to their group. 👀

      In order to join the group, simply click the **"Accept"** button below. 🟢
      To reject the invitation, click the **"Reject"** button or just ignore this message. 🔴

      This invitation automatically expires in 3 days, however you can always request an another one from an operator. ⌛

      In case you are receiving an error displaying "This interaction failed", this probably means that the invitation expired or the bot has restarted. You may want to request an another invitation. However, if this issue persists, feel free to contact **@${DEVELOPER_USERNAME}**. 🤖 

      Remember that all groups are **__unmoderated__**, so viewer discretion is advised. ⚠️
    `
    )
    .setColor("Gold")
    .setFooter({
      text: helpFooter,
    });
}
