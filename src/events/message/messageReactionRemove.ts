import { CommandClient, Constants, Event, Member, Message } from "athena-prime";
import config from '../../config';
import { getUser, updateUserStatistics } from "../../utils";

// ----------

class MessageReactionRemoveEvent extends Event<CommandClient> {
  event: string = 'messageReactionRemove' as const;

  async handle(context: CommandClient<any, any>, message: { id: string, channel: { id: string }}, emoji: Constants.APIEmoji, userId: string) {
    const msg = await context.getMessage(message.channel.id, message.id);
    if (msg.author.id !== config.identifiers.targetId || emoji.id !== config.identifiers.emojiId) return;

    const _user = await getUser(userId);
    if (_user.flags.blacklisted || !_user.settings.participating) return;

    // Update Statistics.
    if (_user.statistics.pets >= 0) return;
    await updateUserStatistics(userId, { pets: _user.statistics.pets - 1 });
  }
}

export default new MessageReactionRemoveEvent('messageReactionRemove');
