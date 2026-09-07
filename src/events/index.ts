import guildCreate from './guild/guildCreate';
import guildDelete from './guild/guildDelete';
import messageReactionAdd from './message/messageReactionAdd';
import messageReactionRemove from './message/messageReactionRemove';
import ready from './client/ready';

// ----------

export default [
  guildCreate,
  guildDelete,
  messageReactionAdd,
  messageReactionRemove,
  ready,
];
