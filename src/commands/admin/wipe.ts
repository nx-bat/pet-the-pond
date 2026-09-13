import { Command, CommandBuilder, CommandClient, CommandInteraction, Constants, SlashCommand } from "athena-prime";
import database from "../../database";

// ----------

@SlashCommand(
  new CommandBuilder('wipe', 'Wipes all points for the guild or specific user. THIS DOES NOT ASK FOR CONFIRMATION!')
    .setIntegrationTypes(Constants.ApplicationIntegrationType.GuildInstall)
    .setContexts(Constants.InteractionContextType.Guild)
    .setCommandType(Constants.ApplicationCommandType.ChatInput)
    .setMemberPermission(Constants.PermissionFlagsBits.ManageGuild)
    .addUserOption('target', "Optional. The user to wipe.", false)
)
class RankCommand extends Command<CommandClient> {
  users = [
    '1363132678022631428', // Nix.
    '454653142500507649', // Ann.
    '147433323503943680' // Pond.
  ];

  async handleCommand(context: CommandClient<any, any>, interaction: CommandInteraction) {
    if (!interaction.inGuild()) return;

    const target = interaction.getUser('target');

    if (!target) {
      await database` UPDATE points SET points = 0 WHERE guild_id = ${interaction.guild.id}`;

      return await interaction.createMessage({
        content: 'Done! All points for this guild have been cleared.',
        flags: Constants.MessageFlags.Ephemeral
      });
    }

    await database` UPDATE points SET points = 0 WHERE user_id = ${target.id} AND guild_id = ${interaction.guild.id} `;

    return await interaction.createMessage({
      content: `Done! *${target.username}*'s points have been wiped.`,
      flags: Constants.MessageFlags.Ephemeral
    });
  }
}

export default new RankCommand('rank');