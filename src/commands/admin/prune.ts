import { Command, CommandBuilder, CommandClient, CommandInteraction, Constants, SlashCommand } from "athena-prime";
import { deleteUser } from "../../utils";

// ----------

@SlashCommand(
  new CommandBuilder('prune', 'Prune users from the database.')
    .setIntegrationTypes(Constants.ApplicationIntegrationType.GuildInstall)
    .setContexts(Constants.InteractionContextType.Guild)
    .setCommandType(Constants.ApplicationCommandType.ChatInput)
    .addUserOption('member', 'The member to prune.')
)
class PruneCommand extends Command<CommandClient> {
  users = [
    '1363132678022631428', // nxbat
    '454653142500507649' // bitdash
  ];

  async handleCommand(context: CommandClient<any, any>, interaction: CommandInteraction) {
    await interaction.defer(true);

    const user = interaction.getRequiredUser('member');
    await deleteUser(user.id);

    await interaction.createMessage({ content: `Pruned: *${user.username}* | ID: ${user.id}` });
  }
}

export default new PruneCommand('prune');
