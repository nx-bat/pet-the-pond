import { Command, CommandBuilder, CommandClient, CommandInteraction, Constants, SlashCommand } from 'athena-prime';
import database from '../database';

// ----------

@SlashCommand(
  new CommandBuilder('leaderboard', 'Get the petting leaderboard.')
    .setIntegrationTypes(Constants.ApplicationIntegrationType.GuildInstall)
    .setContexts(Constants.InteractionContextType.Guild)
    .setCommandType(Constants.ApplicationCommandType.ChatInput),
)
class LeaderboardCommand extends Command<CommandClient> {
  async handleCommand(context: CommandClient<any, any>, interaction: CommandInteraction) {
    if (!interaction.inGuild()) return;

    await interaction.defer();

    const data = await database.leaderboard.getLeaderboard(interaction.guild.id);
    const description = data.length
      ? data
          .map((entry, index) => `**${index + 1}.** <@${entry.userId}> — **${entry.points}** points!`)
          .join('\n')
      : 'Nobody has any points yet!';

    await interaction.createMessage({
      embeds: [
        {
          author: {
            name: interaction.member.username,
            icon_url: interaction.member.avatarURL,
          },

          color: 0xe77ed1,

          title: `Leaderboard | ${interaction.guild.name}`,
          description: description,
        },
      ],
    });
  }
}

export default new LeaderboardCommand('leaderboard');
