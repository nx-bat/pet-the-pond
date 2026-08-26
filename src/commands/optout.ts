import { Command, CommandBuilder, CommandClient, CommandInteraction, Constants, SlashCommand } from "athena-prime";
import { getUser, setUserPrivacy } from "../utils";

@SlashCommand(
  new CommandBuilder('optout', 'Opt out of the Pet the Pond event.')
    .setIntegrationTypes(Constants.ApplicationIntegrationType.GuildInstall)
    .setContexts(Constants.InteractionContextType.Guild)
    .setCommandType(Constants.ApplicationCommandType.ChatInput)
)
class OptOutCommand extends Command<CommandClient> {
  cooldown = 5;

  async handleCommand(context: CommandClient<any, any>, interaction: CommandInteraction) {
    await interaction.defer(true);

    const _user = await getUser(interaction.user.id);
    await setUserPrivacy(_user.user_id, { optin: false });

    await interaction.createMessage({
      content: "Successfully opted out. You won't receive any points for petting :<"
    });
  }
}

export default new OptOutCommand('optout');
