import { ChannelType, Collection, Events, VoiceState } from "discord.js";

import type { Event } from "@/typings/events.d.ts";
import { findGuildMember } from "@/lib/utils.ts";
import {
  CREATE_PUBLIC_VC_CHANNEL_ID,
  PUBLIC_VC_EMOJIS,
} from "@/lib/constants.ts";

const voiceCollection = new Collection();

const event: Event = {
  name: Events.VoiceStateUpdate,

  async execute(oldState: VoiceState, newState: VoiceState) {
    try {
      // Create channel
      if (
        !oldState.channel &&
        newState.channel?.id === CREATE_PUBLIC_VC_CHANNEL_ID
      ) {
        const member = (await findGuildMember(newState.guild, newState.id))!;
        const randomChannelEmoji =
          PUBLIC_VC_EMOJIS[Math.floor(Math.random() * PUBLIC_VC_EMOJIS.length)];
        const channel = await newState.guild.channels.create({
          name: `${randomChannelEmoji} ${member.user.tag}'s Public VC`,
          type: ChannelType.GuildVoice,
          parent: newState.channel.parent,
          nsfw: true,
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
