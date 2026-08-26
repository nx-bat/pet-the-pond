import { Command, CommandBuilder, CommandClient, CommandInteraction, Constants, SlashCommand } from "athena-prime";
import { getUser, setUserPrivacy } from "../../utils";

// ----------

@SlashCommand(
  new CommandBuilder('optin', 'Opt into the Pet the Pond event.')
    .setIntegrationTypes(Constants.ApplicationIntegrationType.GuildInstall)
    .setContexts(Constants.InteractionContextType.Guild)
    .setCommandType(Constants.ApplicationCommandType.ChatInput)
)
class OptInCommand extends Command<CommandClient> {
  cooldown = 5;

  async handleCommand(context: CommandClient<any, any>, interaction: CommandInteraction) {
    await interaction.defer(true);

    const _user = await getUser(interaction.user.id);
    await setUserPrivacy(_user.user_id, { optin: true });

    await interaction.createMessage({
      content: "Successfully opted in. You'll receive points for your pets!",
    });
  }
}

export default new OptInCommand('optin');
