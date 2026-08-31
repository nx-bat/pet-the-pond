import { Command, CommandBuilder, CommandClient, CommandInteraction, Constants, SlashCommand } from 'athena-prime';
import { database } from '../utils';

// ----------

@SlashCommand(
  new CommandBuilder('leaderboard', 'Get the petting leaderboard.')
    .setIntegrationTypes(Constants.ApplicationIntegrationType.GuildInstall)
    .setContexts(Constants.InteractionContextType.Guild)
    .setCommandType(Constants.ApplicationCommandType.ChatInput),
)
class LeaderboardCommand extends Command<CommandClient> {
  cooldown = 15;

  async handleCommand(context: CommandClient<any, any>, interaction: CommandInteraction) {
    await interaction.defer();

    const _data = await database.getHighestPets();
    const description = _data.length
      ? _data
          .map((entry, index) => `**${index + 1}.** <@${entry.userId}> — **${entry.pets.toLocaleString()}** pets!`)
          .join('\n')
      : 'Nobody has any pets yet!';

    await interaction.createMessage({
      embeds: [
        {
          author: {
            name: interaction.user.username,
            icon_url: interaction.user.avatarURL,
          },

          color: 0xe77ed1,

          title: "Pond's Petting Leaderboard",
          description: description,

          footer: {
            text: `Made by nxbat @ Archwing`,
            icon_url: 'https://femboytrain.ing/nxbat-archwing',
          },
        },
      ],
    });
  }
}

export default new LeaderboardCommand('leaderboard');
