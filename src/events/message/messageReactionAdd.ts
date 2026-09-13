import { CommandClient, Constants, Event, Member, Message } from 'athena-prime';
import database from '../../database';

// ----------

class MessageReactionAddEvent extends Event<CommandClient> {
  event: string = 'messageReactionAdd' as const;

  async handle(context: CommandClient<any, any>, message: Message, emoji: Constants.APIEmoji, member: Member) {
    const _message = await context.getMessage(message.channel.id, message.id);
    if (!_message.guildID || emoji.id != '1547870117080342548' || member.id == _message.author.id) return;

    await database`
      INSERT INTO points AS p (user_id, guild_id, points)
        VALUES (${_message.author.id}, ${_message.guildID}, 1)
      ON CONFLICT (user_id, guild_id)
        DO UPDATE SET points = p.points + 1
    `;
  }
}

export default new MessageReactionAddEvent('messageReactionAdd');
