import { CommandClient, Constants, Event, Member, Message } from "athena-prime";
import config from '../../config';

// ----------

class MessageReactionRemoveEvent extends Event<CommandClient> {
  event: string = 'messageReactionRemove' as const;

  async handle(context: CommandClient<any, any>, message: { id: string, channel: { id: string }}, emoji: Constants.APIEmoji, user: string) {
    const msg = await context.getMessage(message.channel.id, message.id);
    if (msg.author.id !== config.identifiers.targetId || emoji.id !== config.identifiers.emojiId) return;

    console.log(`[MESSAGE_REACTION_REMOVE] - ID: ${user}`);
  }
}

export default new MessageReactionRemoveEvent('messageReactionRemove');
