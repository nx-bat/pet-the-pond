import { CommandClient, Event, Guild } from 'athena-prime';
import database from '../../database';

// ----------

class GuildCreateEvent extends Event<CommandClient> {
  event: string = 'guildDelete' as const;

  // TODO: Implement weekly config cleanup task instead.
  async handle(context: CommandClient<any, any>, guild: Guild | { id: string }) {
    await database.config.deleteConfig(guild.id);
  }
}

export default new GuildCreateEvent('guildDelete');
