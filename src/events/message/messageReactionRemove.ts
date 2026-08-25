import { CommandClient, Constants, Event, Member, Message } from "athena-prime";
import config from '../../config.json';

// ----------

class MessageReactionRemoveEvent extends Event<CommandClient> {
  event: string = 'messageReactionRemove' as const;

  async handle(context: CommandClient<any, any>, message: Message, emoji: Constants.APIEmoji, member: Member) {
    const msg = await context.getMessage(message.channel.id, message.id);
    if (msg.author.id !== config.identifiers.targetId || emoji.id !== config.identifiers.emojiId) return;

    console.log(`[MESSAGE_REACTION_REMOVE] - Points: ${member.username} (ID: ${member.id})`);
  }
}

export default new MessageReactionRemoveEvent('messageReactionRemove');
