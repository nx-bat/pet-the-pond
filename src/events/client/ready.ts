import { CommandClient, Event } from 'athena-prime';

// ----------

class ReadyEvent extends Event<CommandClient> {
  event: string = 'ready' as const;

  async handle(context: CommandClient<any, any>) {
    await context.deployCommands();
    context.setCustomActivity('Tracking your petting!');

    await context.createMessage(process.env.LOGGING_CHANNEL, {
      embed: {
        color: 0x55ff55,

        title: 'Bot Ready',

        fields: [
          { name: 'Guilds', value: `${context.guilds.size}`, inline: true },
          { name: 'Shards', value: `${context.shards.size}`, inline: true },
        ]
      }
    });
  }
}

export default new ReadyEvent('ready');
