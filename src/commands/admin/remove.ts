import { Command, CommandBuilder, CommandClient, CommandInteraction, Constants, SlashCommand } from "athena-prime";
import { deleteUser } from "../../utils";

// ----------

@SlashCommand(
  new CommandBuilder('remove', 'Remove a user from the database.')
    .setIntegrationTypes(Constants.ApplicationIntegrationType.GuildInstall)
    .setContexts(Constants.InteractionContextType.Guild)
    .setCommandType(Constants.ApplicationCommandType.ChatInput)
    .addUserOption('user', 'The user to remove.', true)
)
class RemoveCommand extends Command<CommandClient> {
  users = ['1363132678022631428'];

  async handleCommand(context: CommandClient<any, any>, interaction: CommandInteraction) {
    await interaction.defer(true);

    await deleteUser(interaction.getRequiredUser('user').id);
    await interaction.createMessage({ content: `Successfully removed: ${interaction.user.mention} (*${interaction.user.username}*)`});
  }
}

export default new RemoveCommand('remove');
