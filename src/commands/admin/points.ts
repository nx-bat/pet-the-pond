import { Command, CommandBuilder, CommandClient, CommandInteraction, Constants, SlashCommand } from "athena-prime";
import database from "../../database";

// ----------

@SlashCommand(
  new CommandBuilder('points', "Adjust a user's points.")
    .setIntegrationTypes(Constants.ApplicationIntegrationType.GuildInstall)
    .setContexts(Constants.InteractionContextType.Guild)
    .setCommandType(Constants.ApplicationCommandType.ChatInput)
    .setMemberPermission(Constants.PermissionFlagsBits.ManageGuild)
    
    .addSubcommand('give', 'Give points to a user.', builder => {
      builder.addUserOption('target', 'The user to modify.', true);
      builder.addNumberOption({ name: 'points', description: 'The points to give.', required: true, min_value: 1 })
    })
    .addSubcommand('take', 'Take points from a user.', builder => {
      builder.addUserOption('target', 'The user to modify.', true);
      builder.addNumberOption({ name: 'points', description: 'The points to take.', required: true, min_value: 1 })
    })
    .addSubcommand('set', 'Set the points of a user.', builder => {
      builder.addUserOption('target', 'The user to modify.', true);
      builder.addNumberOption({ name: 'points', description: 'The new points value.', required: true })
    })
)
class RankCommand extends Command<CommandClient> {
  users = [
    '1363132678022631428', // Nix.
    '454653142500507649', // Ann.
    '147433323503943680' // Pond.
  ];

  async handleCommand(context: CommandClient<any, any>, interaction: CommandInteraction) {
    if (!interaction.inGuild()) return;

    const target = interaction.getRequiredUser('target');
    const points = interaction.getRequiredNumber('points');

    switch (interaction.subcommand) {
      case 'give':
        await database`
          INSERT INTO points AS p (user_id, guild_id, points)
            VALUES (${target.id}, ${interaction.guild.id}, ${points})
          ON CONFLICT (user_id, guild_id)
            DO UPDATE SET points = p.points + ${points}
        `;

        return await interaction.createMessage({
          content: `Done! *${target.username}* has been given **${points}** points.`,
          flags: Constants.MessageFlags.Ephemeral
        });

      case 'take':
        await database`
          INSERT INTO points AS p (user_id, guild_id, points)
            VALUES (${target.id}, ${interaction.guild.id}, 0)
          ON CONFLICT (user_id, guild_id)
            DO UPDATE SET points = GREATEST(p.points - ${points}, 0)
        `;

        return await interaction.createMessage({
          content: `Done! *${target.username}* has lost **${points}** points.`,
          flags: Constants.MessageFlags.Ephemeral
        });

      case 'set':
        await database`
          INSERT INTO points (user_id, guild_id, points)
            VALUES (${target.id}, ${interaction.guild.id}, ${points})
          ON CONFLICT (user_id, guild_id)
            DO UPDATE SET points = ${points}
        `;

        return await interaction.createMessage({
          content: `Done! *${target.username}*'s points has been set to **${points}**.`,
          flags: Constants.MessageFlags.Ephemeral
        });
    }
  }
}

export default new RankCommand('rank');