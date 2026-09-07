import { Command, CommandBuilder, CommandClient, CommandInteraction, Constants, SlashCommand } from "athena-prime";
import database from "../database";

// ----------

@SlashCommand(
  new CommandBuilder('settings', 'Configure guild-level settings.')
    .setIntegrationTypes(Constants.ApplicationIntegrationType.GuildInstall)
    .setContexts(Constants.InteractionContextType.Guild)
    .setCommandType(Constants.ApplicationCommandType.ChatInput)
    .setMemberPermission(Constants.PermissionFlagsBits.ManageGuild)
    .addSubcommand('emoji', 'Set the emoji used for petting.', (builder) => {
      builder.addStringOption({
        name: 'value',
        description: 'The custom emoji ID to use.',
        required: true,
        min_length: 17,
        max_length: 20,
      });
    })
)
class SettingsCommand extends Command<CommandClient> {
  userPermissions = [Constants.PermissionFlagsBits.ManageGuild];

  async handleCommand(context: CommandClient<any, any>, interaction: CommandInteraction) {
    if (!interaction.inGuild() || !interaction.subcommand) return;
    await interaction.defer(true);

    switch (interaction.subcommand) {
      case 'emoji':
        const config = await database.config.getOrCreateConfig(interaction.guild.id);
        const emojiId = interaction.getRequiredString('value');

        if (!/^\d{17,20}$/.test(emojiId)) {
          return await interaction.createMessage({ content: 'Please provide a valid custom emoji ID.' });
        }

        await database.config.updateConfig(interaction.guild.id, {
          ...config,
          emoji_id: emojiId,
        });
    
        return await interaction.createMessage({ content: `The reaction emoji ID has been set to ${emojiId}.` });
    }
  }
}

export default new SettingsCommand('settings');