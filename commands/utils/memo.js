const sqlite3 = require("sqlite3").verbose();
const {PermissionFlagsBits} = require('discord.js');

//connexion
const db = new sqlite3.Database(process.env.DB_LOCATION, sqlite3.OPEN_READWRITE, (err) =>{
    if(err) return console.log(err.message);
} );

const request = `SELECT name, p.first_name, p.last_name, p.email FROM matiere
                        INNER JOIN main.profs p on p.id = matiere.profid`;

module.exports = {
    name: 'memo',
    category: 'utils',
    ownerOnly: false,
    usage: 'memo',
    examples: ['memo'],
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
    description: 'Mémo sur les professeur en cas de besoin',

    async runInteraction(client, interaction){
        var result = "‎";
        db.all(request, [], (err,rows)=>{
            rows.forEach((row) =>{
                result += `\n**${row.name}**\n`
                result += `${row.first_name.charAt(0).toUpperCase() + row.first_name.slice(1)} ${row.last_name.toUpperCase()}\n`
                result += `\`${row.email}\`\n`
            })
            const embedQuestion = {
                color: 0x735B8B,
                title: 'Mémo',
                url: 'https://myges.fr/student/student-teacher-directory',
                description:` ${result} `,
                timestamp: new Date(),
                footer: {
                    text: interaction.user.tag,
                    icon_url: interaction.user.displayAvatarURL(),
                },
            };

            interaction.reply({content: null, embeds: [embedQuestion]})
        })

    }
};
