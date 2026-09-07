import { CommandClient, Event, Guild } from 'athena-prime';
import database from '../../database';

// ----------

class GuildCreateEvent extends Event<CommandClient> {
  event: string = 'guildCreate' as const;

  async handle(context: CommandClient<any, any>, guild: Guild) {
    await database.config.getOrCreateConfig(guild.id);
  }
}

export default new GuildCreateEvent('guildCreate');
