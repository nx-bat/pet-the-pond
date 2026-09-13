import { Command, CommandBuilder, CommandClient, CommandInteraction, Constants, SlashCommand } from "athena-prime";
import database from "../database";

// ----------

async function getPoints(id: string, guild_id: string): Promise<number> {
  const [row] = await database`
    SELECT points
    FROM points
    WHERE user_id = ${id}
      AND guild_id = ${guild_id}
  `;

  return row?.points ?? 0;
}

async function getLeaderboardPosition(id: string, guild_id: string): Promise<number | null> {
  const [row] = await database`
    SELECT position
    FROM (
      SELECT
        user_id,
        RANK() OVER (ORDER BY points DESC) AS position
      FROM points
      WHERE guild_id = ${guild_id}
        AND points > 0
    ) leaderboard
    WHERE user_id = ${id}
  `;

  return row?.position ?? null;
}

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

    const _points = await getPoints(interaction.member.id, interaction.guild.id);
    const _rank = await getLeaderboardPosition(interaction.member.id, interaction.guild.id);

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

// ----------

export default new RankCommand('rank');