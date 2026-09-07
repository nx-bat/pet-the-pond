import { CommandClient, Constants, Event } from 'athena-prime';
import database from '../../database';

// ----------

class MessageReactionRemoveEvent extends Event<CommandClient> {
  event: string = 'messageReactionRemove' as const;

  async handle(context: CommandClient<any, any>, message: { id: string; channel: { id: string } }, emoji: Constants.APIEmoji, userId: string) {
    const _msg = await context.getMessage(message.channel.id, message.id);
    if (!_msg.guildID) return;

    const _config = await database.config.getOrCreateConfig(_msg.guildID);
    if (emoji.id !== _config.emoji_id) return;

    const _entry = await database.points.getOrCreatePoints(_msg.guildID, userId);
    await database.points.updatePoints(_msg.guildID, userId, _entry - 1n);
  }
}

export default new MessageReactionRemoveEvent('messageReactionRemove');
