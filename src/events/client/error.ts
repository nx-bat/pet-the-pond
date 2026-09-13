import { CommandClient, Event } from 'athena-prime';

// ----------

class ErrorEvent extends Event<CommandClient> {
  event: string = 'error' as const;

  async handle(context: CommandClient<any, any>, error: string | Error, shard?: number | undefined) {
    const _err = error as Error;

    await context.createMessage(process.env.LOGGING_CHANNEL, {
      embed: {
        color: 0xff5555,

        title: 'Error',

        fields: [
          { name: 'Message', value: _err.message, inline: false },
          { name: 'Cause', value: `${_err.cause ?? 'N/A'}`, inline: false },
          { name: 'Stack', value: `${_err.stack ?? 'N/A'}`, inline: false }
        ]
      }
    });
  }
}

export default new ErrorEvent('error');
