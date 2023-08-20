const sqlite3 = require("sqlite3").verbose();
//connexion
const db = new sqlite3.Database(process.env.DB_LOCATION, sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.log(err.message);
});

const {ApplicationCommandOptionType, PermissionFlagsBits} = require('discord.js');

module.exports = {
    name: 'deletematiere',
    category: 'moderation',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    ownerOnly: false,
    usage: 'deletematiere',
    examples: 'deletematiere',
    description: 'Supprimer une matière de la base de donnée',
    options: [
        {
            name: 'matière',
            description: 'Liste des matières disponible',
            type: ApplicationCommandOptionType.Number,
            choices: profs(db),
            required: true,
        },
    ],
    async runInteraction(client, interaction) {
        const matiereId = interaction.options.getNumber('matière');

        db.run(`DELETE
                FROM matiere
                WHERE id = ${matiereId}`, err => {
            if (err === null) {
                const embedConfigList = {
                    color: 0x735B8B,
                    title: 'Matière',
                    description: `La matière à bien été suprimmer de la base`
                }
                interaction.reply({embeds: [embedConfigList], ephemeral: true})
            }
        })

    }
};

function profs(db) {
    var result = [];

    const request = `
        SELECT id, name
        FROM matiere`;

    db.all(request, [], (err, rows) => {
        rows.forEach((row) => {
            const value = {
                name: row.name,
                value: row.id
            }
            result.push(value)
        })
    })
    return result
}