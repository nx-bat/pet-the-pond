import { CommandClient, Constants, Event } from 'athena-prime';
import database from '../../database';

// ----------

class MessageReactionRemoveEvent extends Event<CommandClient> {
  event: string = 'messageReactionRemove' as const;

  async handle(context: CommandClient<any, any>, message: { id: string; channel: { id: string } }, emoji: Constants.APIEmoji, userId: string) {
    const _message = await context.getMessage(message.channel.id, message.id);

    if (!_message.guildID || emoji.id != '1547870117080342548' || userId == _message.author.id) return;
    await database.points.takePoints(_message.author.id, _message.guildID, 1);
  }
}

export default new MessageReactionRemoveEvent('messageReactionRemove');
