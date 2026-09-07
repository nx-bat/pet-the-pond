import { CommandClient, Constants, Event, Member, Message } from 'athena-prime';
import database from '../../database';

// ----------

class MessageReactionAddEvent extends Event<CommandClient> {
  event: string = 'messageReactionAdd' as const;

  async handle(context: CommandClient<any, any>, message: Message, emoji: Constants.APIEmoji, member: Member) {
    const _config = await database.config.getOrCreateConfig(member.guild.id);
    if (emoji.id !== _config.emoji_id) return;

    const _entry = await database.points.getOrCreatePoints(member.guild.id, member.id);
    await database.points.updatePoints(member.guild.id, member.id, _entry + 1n);
  }
}

export default new MessageReactionAddEvent('messageReactionAdd');
