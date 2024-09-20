import { ChannelType, Collection, Events, VoiceState } from "discord.js";

import type { Event } from "@/typings/events.d.ts";
import {
  CREATE_PRIVATE_VC_CHANNEL_ID,
  PRIVATE_VC_EMOJIS,
} from "@/lib/constants.ts";
import { findGuildMember } from "@/lib/utils.ts";

const voiceCollection = new Collection();

const event: Event = {
  name: Events.VoiceStateUpdate,

  async execute(oldState: VoiceState, newState: VoiceState) {
    try {
      // Create channel
      if (
        !oldState.channel &&
        newState.channel?.id === CREATE_PRIVATE_VC_CHANNEL_ID
      ) {
        const member = (await findGuildMember(newState.guild, newState.id))!;
        const randomChannelEmoji =
          PRIVATE_VC_EMOJIS[
            Math.floor(Math.random() * PRIVATE_VC_EMOJIS.length)
          ];
        const channel = await newState.guild.channels.create({
          name: `${randomChannelEmoji} ${member.user.tag} Private VC`,
          type: ChannelType.GuildVoice,
          parent: newState.channel.parent,
          nsfw: true,
          permissionOverwrites: [
            {
              id: newState.guild.roles.everyone.id,
              deny: ["ViewChannel"],
            },
            {
              id: member.id,
              allow: ["ViewChannel", "DeafenMembers", "MuteMembers"],
            },
          ],
        });

        await member.voice.setChannel(channel.id);
        voiceCollection.set(member.user.id, channel.id);
      }

      // Delete channel
      if (!newState.channel) {
        if (oldState.channelId === voiceCollection.get(newState.id))
          return await oldState.channel?.delete();
      }
    } catch (err) {
      console.error(err);
    }
  },
};

export default event;
