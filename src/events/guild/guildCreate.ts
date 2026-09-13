import { CommandClient, Event, Guild } from 'athena-prime';

// ----------

class GuildCreateEvent extends Event<CommandClient> {
  event: string = 'guildCreate' as const;

  async handle(context: CommandClient<any, any>, guild: Guild) {
    await context.createMessage(process.env.LOGGING_CHANNEL, {
      embed: {
        color: 0x55ff55,

        thumbnail: {
          url: guild.iconURL!,
        },

        title: 'Joined Guild',

        fields: [
          { name: 'Name', value: `${guild.name}`, inline: false },
          { name: 'Name', value: `${guild.id}`, inline: false },
          { name: 'Owner', value: `${(await context.fetchUser(guild.ownerID)).username}`, inline: false },
          { name: 'Members', value: `${guild.memberCount}`, inline: false },
          { name: 'Large', value: `${guild.large}`, inline: false },
        ],
      }
    });
  }
}

export default new GuildCreateEvent('guildCreate');
