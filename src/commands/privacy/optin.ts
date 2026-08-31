import { Command, CommandBuilder, CommandClient, CommandInteraction, Constants, SlashCommand } from 'athena-prime';
import { database } from '../../utils';

// ----------

@SlashCommand(
  new CommandBuilder('optin', 'Stop counting your pet interactions.')
    .setIntegrationTypes(Constants.ApplicationIntegrationType.GuildInstall)
    .setContexts(Constants.InteractionContextType.Guild)
    .setCommandType(Constants.ApplicationCommandType.ChatInput),
)
class OptInCommand extends Command<CommandClient> {
  cooldown = 5;

  async handleCommand(context: CommandClient<any, any>, interaction: CommandInteraction) {
    await interaction.defer(true);

    await database.updateUserSettings(interaction.user.id, { participating: true });

    await interaction.createMessage({
      content: "Successfully opted in. You'll receive points for your pets!",
    });
  }
}

export default new OptInCommand('optin');
