import { Command, CommandBuilder, CommandClient, CommandInteraction, Constants, SlashCommand } from "athena-prime";
import database from "../database";

// ----------

@SlashCommand(
  new CommandBuilder('rank', 'See your rank information.')
    .setIntegrationTypes(Constants.ApplicationIntegrationType.GuildInstall)
    .setContexts(Constants.InteractionContextType.Guild)
    .setCommandType(Constants.ApplicationCommandType.ChatInput)
)
class RankCommand extends Command<CommandClient> {
  async handleCommand(context: CommandClient<any, any>, interaction: CommandInteraction) {
    if (!interaction.inGuild()) return;

    await interaction.defer();

    const _points = await database.points.getOrCreatePoints(interaction.guild.id, interaction.member.id);
    const _rank = await database.leaderboard.getLeaderboardPosition(interaction.guild.id, interaction.member.id);

    await interaction.createMessage({
      embeds: [{
        author: {
          name: interaction.member.username,
          icon_url: interaction.member.avatarURL
        },

        color: 0xe77ed1,
        title: `Rank | ${interaction.member.username}`,

        fields: [
          { name: 'Points', value: `${_points}`, inline: true },
          { name: 'Rank', value: `${_rank ?? 'N/A'}`, inline: true }
        ],
      }]
    });
  }
}

export default new RankCommand('rank');