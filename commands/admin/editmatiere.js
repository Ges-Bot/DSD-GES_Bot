const sqlite3 = require("sqlite3").verbose();
//connexion
const db = new sqlite3.Database(process.env.DB_LOCATION, sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.log(err.message);
});

const {ApplicationCommandOptionType, PermissionFlagsBits} = require('discord.js');

module.exports = {
    name: 'editmatiere',
    category: 'moderation',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    ownerOnly: false,
    usage: 'editmatiere',
    examples: 'editmatiere',
    description: 'editer une matiere dans la base de donnée',
    options: [
        {
            name: 'matiere',
            description: 'nom de la matière',
            type: ApplicationCommandOptionType.Number,
            choices: matiere(db),
            required: true,
        },
        {
            name: 'prof',
            description: 'nom de l\'intervenant',
            type: ApplicationCommandOptionType.Number,
            choices: profs(db),
            required: true,
        },
    ],
    async runInteraction(client, interaction) {
        const profId = interaction.options.getNumber('prof')
        const matiereId = interaction.options.getNumber('matiere');
        db.run(`UPDATE matiere
                SET profid = ${profId}
                WHERE id = ${matiereId}`, err => {
            if (err === null) {
                const embedConfigList = {
                    color: 0x735B8B,
                    title: 'Matière',
                    description: `le prof de la matière à bien été modifié dans la base`
                }
                interaction.reply({embeds: [embedConfigList], ephemeral: true})
            } else {
                interaction.reply({content: err.toString(), ephemeral: true})
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

function matiere(db) {
    var result = [];

    const request = `SELECT id, name
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