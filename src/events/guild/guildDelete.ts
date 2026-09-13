import { CommandClient, Event, Guild } from 'athena-prime';

// ----------

class GuildCreateEvent extends Event<CommandClient> {
  event: string = 'guildCreate' as const;

  async handle(context: CommandClient<any, any>, guild: { id: string; }) {
    await context.createMessage(process.env.LOGGING_CHANNEL, {
      embed: {
        color: 0xff5555,

        title: 'Left Guild',

        fields: [
          { name: 'Name', value: `${guild.id}`, inline: false }
        ],
      }
    });
  }
}

export default new GuildCreateEvent('guildCreate');
