import { CommandClient, Event } from 'athena-prime';

// ----------

class ErrorEvent extends Event<CommandClient> {
  event: string = 'ready' as const;

  async handle(context: CommandClient<any, any>, error: string | Error, shard?: number | undefined) {
    const _err = error as Error;

    await context.createMessage('1548676420136599624', {
      embed: {
        color: 0xff5555,

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
