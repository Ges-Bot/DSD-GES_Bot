const sqlite3 = require("sqlite3").verbose();
//connexion
const db = new sqlite3.Database(process.env.DB_LOCATION, sqlite3.OPEN_READWRITE, (err) =>{
    if(err) return console.log(err.message);
} );

const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'config',
    category: 'moderation',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    ownerOnly: false,
    usage: 'config',
    examples: 'config',
    description: 'Ajouter de la configuration à la base de donée.',
    options:[
        {
            name: 'type',
            description: 'Que voulez vous faire dans la configuration ?',
            type: ApplicationCommandOptionType.Number,
            required: true,
            choices:[
                {
                    name: 'list',
                    value: 1
                },
                {
                    name: 'ajouter',
                    value: 2
                }
            ],
        },
        {
           name: 'devoirs_channel',
           description: 'Indiquez dans quel salon seront envoyés les annonces de devoirs',
           type: ApplicationCommandOptionType.Channel,
           required: false
        }
    ],
    async runInteraction(client, interaction){
        const commandType = interaction.options.getNumber('type')
        db.get(`SELECT id FROM guild_list where guild_id = ${interaction.guild.id}`, (err, idGuild)=>{

            const idGuildId = idGuild.id

            if (commandType === 1){
                db.get(`SELECT * FROM guild_config
                        JOIN guild_list gl on gl.id = guild_config.guildid
                        WHERE guildid = ${idGuildId};`, (err, guildConfigs)=>{

                    const embedConfigList = {
                        color: 0x735B8B,
                        title: 'Serveur config',
                        description: `La liste des configuartion pour le serveur **${guildConfigs.guild_name}**
                                 \n-Channel de devoir : <#${guildConfigs.channel_devoir_id}>`
                    }
                    interaction.reply({ embeds: [embedConfigList] })
                })
            }else{
                const channelDevoir = interaction.options.getChannel('devoirs_channel')
                db.run(`UPDATE guild_config SET channel_devoir_id = ${channelDevoir.id} WHERE guildid = ${idGuildId}`)
                const embedConfigList = {
                    color: 0x735B8B,
                    title: 'Serveur config',
                    description: `La configuration à bien été ajoutée, faite \`/config type:list\` pour vérifier.`
                }
                interaction.reply({ embeds: [embedConfigList], ephemeral: true })
            }
        })
    }
};