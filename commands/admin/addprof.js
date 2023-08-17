const sqlite3 = require("sqlite3").verbose();
//connexion
const db = new sqlite3.Database(process.env.DB_LOCATION, sqlite3.OPEN_READWRITE, (err) =>{
    if(err) return console.log(err.message);
} );

const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'addprof',
    category: 'moderation',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    ownerOnly: false,
    usage: 'addprof',
    examples: 'addprof',
    description: 'Ajouter un intervenant à la base de donnée NOT USABLE',
    options:[
        {
            name: 'prenom',
            description: 'Prénom de l\'intervennant',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'nom',
            description: 'Nom de l\'intervennant',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'mail',
            description: 'E-mail de l\'intervennant',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    async runInteraction(client, interaction){
        const firstName = interaction.options.getString('prenom')
        const lastName = interaction.options.getString('nom')
        const eMail = interaction.options.getString('mail')

        db.run(`INSERT INTO profs (first_name, last_name, email) VALUES (\'${firstName}\', \'${lastName}\',\'${eMail}\')`).then(()=>{
            const embedConfigList = {
                color: 0x735B8B,
                title: 'Intervenant',
                description: `L'intervenant à bien été ajouter à la base`
            }
            interaction.reply({ embeds: [embedConfigList], ephemeral: true })
        })

    }
};