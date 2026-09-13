import error from './client/error';
import ready from './client/ready';

import guildCreate from './guild/guildCreate';
import guildDelete from './guild/guildDelete';

import messageReactionAdd from './message/messageReactionAdd';
import messageReactionRemove from './message/messageReactionRemove';

// ----------

export default [
  error, ready, // Client.
  guildCreate, guildDelete, // Guild.
  messageReactionAdd, messageReactionRemove // Message.
];
