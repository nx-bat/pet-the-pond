import { Command, CommandBuilder, CommandClient, CommandInteraction, Constants, SlashCommand } from "athena-prime";
import { setUserPrivacy } from "../utils";

@SlashCommand(
  new CommandBuilder('optin', 'Opt into the Pet the Pond event.')
    .setIntegrationTypes(Constants.ApplicationIntegrationType.GuildInstall)
    .setContexts(Constants.InteractionContextType.Guild)
    .setCommandType(Constants.ApplicationCommandType.ChatInput)
)
class OptInCommand extends Command<CommandClient> {
  cooldown = 5;

  async handleCommand(context: CommandClient<any, any>, interaction: CommandInteraction) {
    await setUserPrivacy(interaction.member.id, { optin: true });

    await interaction.createMessage({
      content: "Successfully opted in. Interactions will be acknowledged.",
      flags: Constants.MessageFlags.Ephemeral
    });
  }
}

export default new OptInCommand('optin');
