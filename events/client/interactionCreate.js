module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(client, interaction) {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) return interaction.reply("Cette commande n'existe pas !");

            if (cmd.ownerOnly) {
                if (interaction.user.id !== ownerID) return interaction.reply("La seule personne pouvant taper cette commande est l'owner du bot!");
            }

            cmd.runInteraction(client, interaction);
        }
    },
};
