const sqlite3 = require("sqlite3").verbose();
//connexion
const db = new sqlite3.Database(process.env.DB_LOCATION, sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.log(err.message);
});

const {ApplicationCommandOptionType, PermissionFlagsBits} = require('discord.js');

module.exports = {
    name: 'addmatiere',
    category: 'moderation',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    ownerOnly: false,
    usage: 'addmatiere',
    examples: 'addmatiere',
    description: 'Ajouter une matiere à la base de donnée',
    options: [
        {
            name: 'nom',
            description: 'nom de la matière',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'prof',
            description: 'Liste des matieres disponible',
            type: ApplicationCommandOptionType.Number,
            choices: profs(db),
            required: true,
        },
    ],
    async runInteraction(client, interaction) {
        const matiereName = interaction.options.getString('nom')
        const profId = interaction.options.getNumber('prof');
        db.get(`SELECT id FROM guild_list WHERE guild_id = ${interaction.guild.id}`, (err, idGuildId)=>{
            console.log(matiereName)
            console.log(profId)
            console.log(idGuildId.id)

            db.run(`INSERT INTO matiere (name, profid, guildid)
                    VALUES (\'${matiereName}\', \'${profId}\', \'${idGuildId.id}\')`, err => {
                console.log(err)
                if (err === null) {
                    const embedConfigList = {
                        color: 0x735B8B,
                        title: 'Matiere',
                        description: `La matiere à été ajouter à la base`
                    }
                    interaction.reply({embeds: [embedConfigList], ephemeral: true})
                }
            })
        })
    }
};

function profs(db){
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