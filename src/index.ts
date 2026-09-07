import 'dotenv/config';

import { CommandClient, Constants, Guild, Member, Message, NullCollection, User } from 'athena-prime';
import commands from './commands';
import database from './database';
import events from './events';

// ----------

const client: CommandClient = new CommandClient({
  token: `Bot ${process.env.DISCORD_TOKEN}`,

  options: {
    intents: [
      Constants.GatewayIntentBits.Guilds,
      Constants.GatewayIntentBits.GuildMessages,
      Constants.GatewayIntentBits.GuildMessageReactions,
    ],

    largeBotOptimizations: true
  },
});

commands.forEach((command) => client.registerCommand(command, true));
events.forEach((event) => client.registerEvent(event, true));

// ----------

database.init();
client.connect();
