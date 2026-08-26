import { Command, CommandBuilder, CommandClient, CommandInteraction, Constants, SlashCommand } from "athena-prime";
import { getPetPosition, getUser } from "../utils";

// ----------

@SlashCommand(
  new CommandBuilder('profile', 'View your profile.')
    .setIntegrationTypes(Constants.ApplicationIntegrationType.GuildInstall)
    .setContexts(Constants.InteractionContextType.Guild)
    .setCommandType(Constants.ApplicationCommandType.ChatInput)
)
class ProfileCommand extends Command<CommandClient> {
  cooldown = 15;

  async handleCommand(context: CommandClient<any, any>, interaction: CommandInteraction) {
    await interaction.defer();

    const _user = await getUser(interaction.user.id);
    const position = await getPetPosition(interaction.user.id);

    await interaction.createMessage({
      embeds: [{
        author: {
          name: interaction.user.username,
          icon_url: interaction.user.avatarURL
        },

        color: 0xe77ed1,

        title: `Your Profile | Pet the Pond`,
        fields: [
          {
            name: 'Pets',
            value: `${_user.statistics.pets}`,
            inline: true
          },
          {
            name: 'Rank',
            value: position ? `#${position}` : 'N/A',
            inline: true
          },
          {
            name: 'Participating',
            value: _user.settings.participating ? 'Yes' : 'No',
            inline: false
          }
        ],

        footer: {
          text: `Made by nxbat @ Archwing`,
          icon_url: 'https://femboytrain.ing/nxbat-archwing'
        }
      }]
    });
  }
}

export default new ProfileCommand('profile');
