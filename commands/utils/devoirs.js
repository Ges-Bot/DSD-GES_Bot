const sqlite3 = require("sqlite3").verbose();
const {PermissionFlagsBits} = require('discord.js');
const dateNow =new Date().getTime()/1000

//connexion
const db = new sqlite3.Database(process.env.DB_LOCATION, sqlite3.OPEN_READWRITE, (err) =>{
    if(err) return console.log(err.message);
} );



const request = `SELECT * FROM devoir
                        inner join main.matiere m on m.id = devoir.matiereid
                        inner join main.profs p on p.id = m.profid
                        where date > ${dateNow}
                        order by date asc `;

module.exports = {
    name: 'devoirs',
    category: 'utils',
    ownerOnly: false,
    usage: 'devoirs',
    examples: ['devoirs'],
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
    description: 'Ressort la liste des devoirs qui arrivents par ordre de date',

    async runInteraction(client, interaction){
        var result = "‎";
        db.all(request, [], (err,rows)=>{
            rows.forEach((row) =>{
                result += `**\n${row.name}\n**`;
                (row.comment)? result += `\n${row.comment}\n` :"";
                (row.date)? result += `**Date de rendu**:<t:${row.date}:f> (<t:${row.date}:R>)\n` :"";
                (row.devoir_type)? result += `**Type de rendu**: ${row.devoir_type}\n` :"";
                (row.associate)? result += `**Ressource lié**: ${row.associate}\n` :"";
            })
            if (!result || result.length == 1){
                result = "Pas de devoir en approche"
            }
            const embedQuestion = {
                color: 0x735B8B,
                title: 'Devoir',
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
