import { CommandClient, Constants, Event } from 'athena-prime';
import config from '../../config';
import { database } from '../../utils';

// ----------

class MessageReactionRemoveEvent extends Event<CommandClient> {
  event: string = 'messageReactionRemove' as const;

  async handle(
    context: CommandClient<any, any>,
    message: { id: string; channel: { id: string } },
    emoji: Constants.APIEmoji,
    userId: string,
  ) {
    const msg = await context.getMessage(message.channel.id, message.id);
    if (msg.author.id !== config.identifiers.targetId || emoji.id !== config.identifiers.emojiId) return;

    const _user = await database.getUser(userId);
    if (!_user.settings.participating) return;

    if (_user.statistics.pets >= 0) return;
    await database.updateUserStatistics(userId, { pets: _user.statistics.pets - 1 });
  }
}

export default new MessageReactionRemoveEvent('messageReactionRemove');
