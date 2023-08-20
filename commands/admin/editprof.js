const sqlite3 = require("sqlite3").verbose();
//connexion
const db = new sqlite3.Database(process.env.DB_LOCATION, sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.log(err.message);
});

const {ApplicationCommandOptionType, PermissionFlagsBits} = require('discord.js');

module.exports = {
    name: 'editprof',
    category: 'moderation',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    ownerOnly: false,
    usage: 'editprof',
    examples: 'editprof',
    description: 'editer un intervenant dans la base de donnée',
    options: [
        {
            name: 'nom',
            description: 'nom de l\'intervenant',
            type: ApplicationCommandOptionType.Number,
            choices: profs(db),
            required: true,
        },
        {
            name: 'email',
            description: 'email à modifier',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    async runInteraction(client, interaction) {
        const profId = interaction.options.getNumber('nom')
        const email = interaction.options.getString('email');
        db.run(`UPDATE profs
                SET email = \'${email}\'
                WHERE id = ${profId}`, err => {
            if (err === null) {
                const embedConfigList = {
                    color: 0x735B8B,
                    title: 'Intervenant',
                    description: `le mail de l\'intervenant à bien été modifié dans la base`
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