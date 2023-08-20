const sqlite3 = require("sqlite3").verbose();
const {PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
    ActionRowBuilder
} = require('discord.js');
const dateNow =new Date().getTime()/1000
//connexion
const db = new sqlite3.Database(process.env.DB_LOCATION, sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.log(err.message);
});

module.exports = {
    name: 'removedevoir',
    category: 'utils',
    ownerOnly: false,
    usage: 'supprimerdevoir',
    examples: ['supprimerdevoir'],
    defaultMemberPermissions: PermissionFlagsBits.ManageChannels,
    description: 'Supprimer un devoir dans la liste',
    async runInteraction(client, interaction) {
        let menu = new StringSelectMenuBuilder()
            .setCustomId(`sub-menu`)
            .setPlaceholder('Je suis un placeholder')
            .setMaxValues(1)

        let devoirDate = new Date(null);
        const request = `SELECT m.name, devoir.id, devoir.devoir_type, date FROM devoir
                    inner join main.matiere m on m.id = devoir.matiereid
                     where date > ${dateNow}
                     order by date asc`;

        db.all(request, [], (err, rows) => {
            if (rows.length !== 0) {
                rows.forEach((row) => {
                    devoirDate.setTime(row.date * 1000);
                    menu.addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(row.name)
                            .setDescription(row.devoir_type + ' pour le : ' + devoirDate.toLocaleString())
                            .setValue(row.id.toString())
                    )
                })
                interaction.reply({
                    components: [new ActionRowBuilder().addComponents(menu)],
                    ephemeral: true
                });
            } else {
                interaction.reply({
                    content: 'Il n\'y à pas de devoir enregistré sur ce serveur.',
                    ephemeral: true
                });
            }

        })
    }
}

