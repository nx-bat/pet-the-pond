import { CommandClient, Constants, Event, Member, Message } from 'athena-prime';
import database from '../../database';

// ----------

class MessageReactionAddEvent extends Event<CommandClient> {
  event: string = 'messageReactionAdd' as const;

  async handle(context: CommandClient<any, any>, message: Message, emoji: Constants.APIEmoji, member: Member) {
    if (emoji.id !== "448912932340891670") return;
    await database.points.addPoints(message.author.id, member.guild.id, 1);
  }
}

export default new MessageReactionAddEvent('messageReactionAdd');
