import { CommandClient, Constants, Guild, Member, Message, NullCollection, User } from 'athena-prime';
import events from './events';

// ----------

const client: CommandClient = new CommandClient({
  token: `Bot ${process.env.DISCORD_TOKEN}`,

  options: {
    intents: [
      Constants.GatewayIntentBits.Guilds,
      Constants.GatewayIntentBits.GuildMembers,
      Constants.GatewayIntentBits.GuildMessages,
      Constants.GatewayIntentBits.MessageContent
    ],

    largeBotOptimizations: true,

    cache: {
      users: () => new NullCollection(User),
      members: () => new NullCollection(Member),
      messages: () => new NullCollection(Message),
      guilds: () => new NullCollection(Guild)
    }
  }
});

events.forEach(event => client.registerEvent(event));

// ----------

client.connect();
