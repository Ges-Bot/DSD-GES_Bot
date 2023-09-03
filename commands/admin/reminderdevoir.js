const sqlite3 = require("sqlite3").verbose();
//connexion
const db = new sqlite3.Database(process.env.DB_LOCATION, sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.log(err.message);
});

const {ApplicationCommandOptionType, PermissionFlagsBits} = require('discord.js');

module.exports = {
    name: 'reminderdevoir',
    category: 'moderation',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    ownerOnly: false,
    usage: 'reminderdevoir',
    examples: 'reminderdevoir',
    description: 'Activer ou non le rappel des devoirs',
    options: [
        {
            name: 'active',
            description: 'Activer ou non le rappel des devoirs',
            type: ApplicationCommandOptionType.Number,
            choices: [
                {
                    name: "Enable",
                    value: 1
                },
                {
                    name: "Disable",
                    value: 0
                },
            ],
            required: true,
        },
    ],
    async runInteraction(client, interaction) {
        const isActive = interaction.options.getNumber('active');
        console.log(isActive)
        db.get(`SELECT reminder, guild_config.guildid
                FROM guild_config
                         INNER JOIN main.guild_list gl on gl.id = guild_config.guildid
                WHERE gl.guild_id = ${interaction.guild.id}`, (err, isEnable) => {

            console.log(isEnable)
            console.log("id updated : " + isEnable.guildid + "with value : " + isActive + "(the actual value is : " + isEnable.reminder + ")")

            if (isEnable.reminder !== isActive) {
                console.log('true')
                db.run(`
                    UPDATE guild_config
                    SET reminder = ${isActive}
                    WHERE guildid = ${isEnable.guildid};
                `, err => {
                    if (err !== null) {
                        console.log(err)
                    }
                })
            }
            const embedConfigList = {
                color: 0x735B8B,
                title: 'Update',
                description: `Le rappel des devoirs à bien été mis à jour`
            }
            interaction.reply({embeds: [embedConfigList], ephemeral: true})
        })
    }
};