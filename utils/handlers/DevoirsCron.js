const sqlite3 = require("sqlite3").verbose();
const dateNow =Math.round( new Date().getTime()/1000)
const dateOneWeek =dateNow + 518400
const cron = require("node-cron")
const {EmbedBuilder} = require("discord.js");


//connexion
const db = new sqlite3.Database(process.env.DB_LOCATION, sqlite3.OPEN_READWRITE, (err) =>{
    if(err) return console.log(err.message);
} );

module.exports = async (client)=>{

    //Lance le script tout les 5eme jours de la semaine à 18h00 -> `0 18 * * 5`
    cron.schedule(`0 18 * * 5`, ()=>{
        db.all(`SELECT * FROM guild_list`, [BigInt(true)], (err,guildIds)=>{

            guildIds.forEach((guildId)=>{
                const currentGuildId = guildId.guild_id;

                const request =`SELECT * FROM devoir
                INNER JOIN main.matiere m on m.id = devoir.matiereid
                INNER JOIN main.profs p on p.id = m.profid
                INNER JOIN main.guild_list gl on gl.id = devoir.guildid
                INNER JOIN main.guild_config gc on devoir.guildid = gc.guildid
                                WHERE date >= ${dateNow}
                                  AND date <= ${dateOneWeek}
                                  AND gl.guild_id = ${currentGuildId.toString()}
                                  AND gc.reminder = 1 `;
                db.all(request,
                    [],
                    (err, devoirs)=>{
                        const embedDevoirs =  new EmbedBuilder()
                        if (devoirs.length === 0){
                            embedDevoirs
                                .setColor('#' + process.env.EMBED_COLOR.toString())
                              .setTitle('Liste des devoirs pour la pochaine fois')
                              .setDescription('Pas de devoir en vue')
                                .setTimestamp()
                                .setFooter({
                                    text: client.user.tag,
                                    icon_url: client.user.displayAvatarURL()
                                })
                        }else{
                            embedDevoirs
                                .setColor('#' + process.env.EMBED_COLOR.toString())
                              .setTitle('Liste des devoirs pour la pochaine fois')
                                .setTimestamp()
                                .setFooter({
                                    text: client.user.tag,
                                    icon_url: client.user.displayAvatarURL()
                                })
                            devoirs.forEach((devoir)=>{
                                let comment;
                                if(devoir.comment === "null"){
                                    comment = ""
                                }else{
                                    comment = `\n------\n${devoir.comment}`
                                }
                                embedDevoirs.addFields([

                                    {
                                        name: devoir.name,
                                        value: `${devoir.devoir_type}${comment}`,
                                        inline: true
                                    },
                                    {
                                        name: 'Pour le',
                                        value: `<t:${devoir.date}:f>`,
                                        inline: true
                                    },
                                    {
                                        name: 'Dans',
                                        value: `<t:${devoir.date}:R>`,
                                        inline: true
                                    }
                                ])

                            })

                        }
                        db.get(`SELECT * FROM guild_config
                                    INNER JOIN main.guild_list gl on gl.id = guild_config.guildid
                                    WHERE gl.guild_id = ${currentGuildId.toString()};`, (err, id)=>{


                            const channel = client.channels.cache.get(id.channel_devoir_id)


                            channel.send({embeds: [embedDevoirs]});
                        })
                    })
            })
        })

    })
}