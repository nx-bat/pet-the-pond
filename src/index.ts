import 'dotenv/config';

import { CommandClient, Constants } from 'athena-prime';
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

database`
  CREATE TABLE IF NOT EXISTS points (
    user_id TEXT NOT NULL,
    guild_id TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),

    PRIMARY KEY (user_id, guild_id)
  )
`;

// ----------

client.connect();
