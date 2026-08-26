import { Command, CommandBuilder, CommandClient, CommandInteraction, Constants, SlashCommand } from "athena-prime";
import config from "../../config";

// ----------

@SlashCommand(
  new CommandBuilder('init', 'Configure bot & settings.')
    .setIntegrationTypes(Constants.ApplicationIntegrationType.GuildInstall)
    .setContexts(Constants.InteractionContextType.Guild)
    .setCommandType(Constants.ApplicationCommandType.ChatInput)
)
class InitCommand extends Command<CommandClient> {
  users = ['1363132678022631428'];

  async handleCommand(context: CommandClient<any, any>, interaction: CommandInteraction) {
    await context.createMessage(interaction.channel.id, {
      embed: {
        color: 0xe77ed1,

        title: 'Pet the Pond!',
        description: `
          There's a Pond that needs petting, and a leaderboard to show off your level of appreciation.

          **How does it work?**
          On any message sent by <@${config.identifiers.targetId}>, react with the <:pet:448912932340891670> emoji to receive a point.

          **What do you get?**
          You get appreciation and proof you appreciate Pond the most.

          **What if I don't want to be involved?**
          You can opt in & out using the \`/optin\` & \`/optout\` commands.
        `,

        footer: {
          text: `Made by nxbat @ Archwing`,
          icon_url: 'https://femboytrain.ing/nxbat-archwing'
        }
      }
    });

    await interaction.createMessage({ content: 'Done.', flags: Constants.MessageFlags.Ephemeral });
  }
}

export default new InitCommand('init');
