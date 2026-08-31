import { CommandClient, Constants, Event, Member, Message } from 'athena-prime';
import config from '../../config';
import { database } from '../../utils';

// ----------

class MessageReactionAddEvent extends Event<CommandClient> {
  event: string = 'messageReactionAdd' as const;

  async handle(context: CommandClient<any, any>, message: Message, emoji: Constants.APIEmoji, member: Member) {
    const msg = await context.getMessage(message.channel.id, message.id);
    if (msg.author.id !== config.identifiers.targetId || emoji.id !== config.identifiers.emojiId) return;

    const _user = await database.getUser(member.id);
    if (!_user.settings.participating) return;

    await database.updateUserStatistics(member.id, { pets: _user.statistics.pets + 1 });
  }
}

export default new MessageReactionAddEvent('messageReactionAdd');
