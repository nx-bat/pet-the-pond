import { Command, CommandBuilder, CommandClient, CommandInteraction, Constants, SlashCommand } from 'athena-prime';
import { updateUserSettings } from '../../utils';

// ----------

@SlashCommand(
  new CommandBuilder('optout', 'Stop counting your pet interactions.')
    .setIntegrationTypes(Constants.ApplicationIntegrationType.GuildInstall)
    .setContexts(Constants.InteractionContextType.Guild)
    .setCommandType(Constants.ApplicationCommandType.ChatInput),
)
class OptOutCommand extends Command<CommandClient> {
  cooldown = 5;

  async handleCommand(context: CommandClient<any, any>, interaction: CommandInteraction) {
    await interaction.defer(true);

    await updateUserSettings(interaction.user.id, { participating: false });

    await interaction.createMessage({
      content: "Successfully opted out. You won't receive any points for petting :<",
    });
  }
}

export default new OptOutCommand('optout');
