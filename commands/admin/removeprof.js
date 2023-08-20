const sqlite3 = require("sqlite3").verbose();
//connexion
const db = new sqlite3.Database(process.env.DB_LOCATION, sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.log(err.message);
});

const {ApplicationCommandOptionType, PermissionFlagsBits} = require('discord.js');

module.exports = {
    name: 'removeprof',
    category: 'moderation',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    ownerOnly: false,
    usage: 'removeprof',
    examples: 'removeprof',
    description: 'Supprimer un intervenant de la base de donnée',
    options: [
        {
            name: 'prof',
            description: 'Liste des intervenants disponible',
            type: ApplicationCommandOptionType.Number,
            choices: profs(db),
            required: true,
        },
    ],
    async runInteraction(client, interaction) {
        const profId = interaction.options.getNumber('prof');

        db.run(`DELETE
                FROM profs
                WHERE id = ${profId}`, err => {
            if (err === null) {
                const embedConfigList = {
                    color: 0x735B8B,
                    title: 'Intervenant',
                    description: `L'intervenant à bien été suprimmer de la base`
                }
                interaction.reply({embeds: [embedConfigList], ephemeral: true})
            }
        })

    }
};

function profs(db) {
    var result = [];

    const request = `
        SELECT id, last_name
        FROM profs`;

    db.all(request, [], (err, rows) => {
        rows.forEach((row) => {
            const value = {
                name: row.last_name,
                value: row.id
            }
            result.push(value)
        })
    })
    return result
}