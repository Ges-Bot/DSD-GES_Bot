const sqlite3 = require("sqlite3").verbose();
const {PermissionFlagsBits, ApplicationCommandOptionType} = require('discord.js');
const dateNow =new Date().getTime()/1000
//connexion
const db = new sqlite3.Database(process.env.DB_LOCATION, sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.log(err.message);
});

module.exports = {
    name: 'remove',
    category: 'utils',
    ownerOnly: false,
    usage: 'remove',
    examples: ['remove'],
    defaultMemberPermissions: PermissionFlagsBits.ManageChannels,
    description: 'Supprimer un devoir dans la liste',
    options: [
        {
            name: 'matiere',
            description: 'Le devoir que vous voulez supprimer',
            type: ApplicationCommandOptionType.Number,
            choices: devoirs(db),
            required: true,
        }
    ],
    async runInteraction(client, interaction) {
        const matiere = interaction.options.getNumber('matiere');;

        db.run(`DELETE FROM devoir WHERE id = ${matiere}`);

        const embedQuestion = {
            color: 0x735B8B,
            title: 'Devoir Supprimé',
            description:` **Un devoir a bien été Supprimé**\n`,
            timestamp: new Date(),
            footer: {
                text: interaction.user.tag,
                icon_url: interaction.user.displayAvatarURL(),
            },
        };

        interaction.reply({embeds: [embedQuestion]})

    }
}

function devoirs(db){
    var result = [];
    var devoirDate = new Date(null);

    const request = `SELECT m.name, devoir.id, date FROM devoir
                    inner join main.matiere m on m.id = devoir.matiereid
                     where date > ${dateNow}
                     order by date asc`;

    db.all(request, [], (err, rows) => {
        rows.forEach((row) => {
            devoirDate.setTime(row.date*1000);

            const value = {
                name: row.name + " du "+devoirDate.toLocaleString(),
                value: row.id
            }
            result.push(value)
        })

    })
    return result
}