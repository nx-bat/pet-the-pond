import { Command, CommandBuilder, CommandClient, CommandInteraction, Constants, SlashCommand } from "athena-prime";
import { deleteUser } from "../../utils";

// ----------

@SlashCommand(
  new CommandBuilder('wipe', 'Wipe a user from the database.')
    .setIntegrationTypes(Constants.ApplicationIntegrationType.GuildInstall)
    .setContexts(Constants.InteractionContextType.Guild)
    .setCommandType(Constants.ApplicationCommandType.ChatInput)
    .addUserOption('user', 'The user to wipe.', true)
)
class WipeCommand extends Command<CommandClient> {
  users = ['1363132678022631428'];

  async handleCommand(context: CommandClient<any, any>, interaction: CommandInteraction) {
    console.log('tes');
    const user = interaction.getRequiredUser('user');
    await deleteUser(user.id);

    await interaction.createMessage({ content: `Successfully wiped: ${interaction.user.mention} (*${interaction.user.username}*)`});
  }
}

export default new WipeCommand('wipe');
