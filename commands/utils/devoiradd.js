const sqlite3 = require("sqlite3").verbose();
const {PermissionFlagsBits, ApplicationCommandOptionType} = require('discord.js');
//connexion
const db = new sqlite3.Database(process.env.DB_LOCATION, sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.log(err.message);
});

module.exports = {
    name: 'devoiradd',
    category: 'utils',
    ownerOnly: false,
    usage: 'ajouterdevoir',
    examples: ['ajouterdevoir'],
    defaultMemberPermissions: PermissionFlagsBits.ManageChannels,
    description: 'Ajouter des devoirs à la liste',
    options: [
        {
            name: 'matiere',
            description: 'Liste des matieres disponible',
            type: ApplicationCommandOptionType.Number,
            choices: matiere(db),
            required: true,
        },
        {
            name: 'date',
            description: 'date du control, ecrit en DD/MM/YYYY',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'type',
            description: 'Le type de devoir à rendre',
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name:'DM',
                    value:'DM'
                },
                {
                    name:'Control/Revision',
                    value:'Control/Revision'
                },
                {
                    name:'Devoir',
                    value:'Devoir'
                },
                {
                    name:'Oral',
                    value:'Oral'
                }
            ],
            required: true,
        },
        {
            name: 'heure',
            description: 'l\'heure du devoir',
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name:'08:00',
                    value:'08:00'
                },
                {
                    name:'09:45',
                    value:'09:45'
                },
                {
                    name:'11:30',
                    value:'11:30'
                },
                {
                    name:'14:00',
                    value:'14:00'
                },
                {
                    name:'15:45',
                    value:'15:45'
                },
                {
                    name:'17:30',
                    value:'17:30'
                },
            ],
            required: false,
        },
        {
            name: 'association',
            description: 'Lien d\'un message ou d\'une ressource associé au devoir.',
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: 'description',
            description: 'Description du control.',
            type: ApplicationCommandOptionType.String,
            required: false
        }

    ],
    async runInteraction(client, interaction) {

        const dateArray = interaction.options.getString('date').split("/")
        var secondDate
        if(interaction.options.getString('heure') !== null){
            const hourArray = interaction.options.getString('heure').split(":");
            secondDate = new Date(parseInt(dateArray[2]), parseInt(dateArray[1])-1, parseInt(dateArray[0]), parseInt(hourArray[0]), parseInt(hourArray[1])).getTime()/1000;
        }else{
            secondDate = new Date(parseInt(dateArray[2]), parseInt(dateArray[1])-1, parseInt(dateArray[0])).getTime()/1000;
        }

        const matiere = interaction.options.getNumber('matiere');
        const type = interaction.options.getString('type');
        const association = interaction.options.getString('association');
        const description = interaction.options.getString('description');

        db.get(`SELECT id FROM guild_list WHERE guild_id = ${interaction.guild.id}`, (err, guildID)=>{
            const querry = db.prepare(`INSERT INTO devoir (devoir_type, comment, associate, matiereid, date, guildid)
                                       VALUES (?, ?, ?, ?, ?, ?)`);
            querry.run(type, description, association, matiere, secondDate, guildID.id);
            querry.finalize();
        })

        const embedQuestion = {
            color: 0x735B8B,
            title: 'Devoir Ajouté',
            description:` **Un devoir a bien été ajouter**\n 
            - **Type**: ${type}\n
            - **Matière ID**: ${matiere}\n
            - **Date**: <t:${secondDate}:D>(<t:${secondDate}:R>)\n
            - **Association**: ${association}\n
            - **Description**: ${description}\n`,
            timestamp: new Date(),
            footer: {
                text: interaction.user.tag,
                icon_url: interaction.user.displayAvatarURL(),
            },
        };

        interaction.reply({embeds: [embedQuestion]})

    }
}

function matiere(db){
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