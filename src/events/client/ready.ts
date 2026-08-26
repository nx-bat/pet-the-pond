import { CommandClient, Event } from 'athena-prime';

// ----------

class ReadyEvent extends Event<CommandClient> {
  event: string = 'ready' as const;

  async handle(context: CommandClient<any, any>) {
    await context.deployCommands();
    context.setCustomActivity('Petting the Pond!');
  }
}

export default new ReadyEvent('ready');
