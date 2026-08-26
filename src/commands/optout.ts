import { Command, CommandBuilder, CommandClient, CommandInteraction, Constants, SlashCommand } from "athena-prime";
import { setUserPrivacy } from "../utils";

@SlashCommand(
  new CommandBuilder('optout', 'Opt out of the Pet the Pond event.')
    .setIntegrationTypes(Constants.ApplicationIntegrationType.GuildInstall)
    .setContexts(Constants.InteractionContextType.Guild)
    .setCommandType(Constants.ApplicationCommandType.ChatInput)
)
class OptOutCommand extends Command<CommandClient> {
  cooldown = 5;

  async handleCommand(context: CommandClient<any, any>, interaction: CommandInteraction) {
    await setUserPrivacy(interaction.member.id, { optin: false });

    await interaction.createMessage({
      content: "Successfully opted out. Interactions will not be acknowledged.",
      flags: Constants.MessageFlags.Ephemeral
    });
  }
}

export default new OptOutCommand('optout');
