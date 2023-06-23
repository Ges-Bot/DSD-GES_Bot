const sqlite3 = require("sqlite3").verbose();
//connexion
const db = new sqlite3.Database(process.env.DB_LOCATION, sqlite3.OPEN_READWRITE, (err) =>{
    if(err) return console.log(err.message);
} );

const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'init',
    category: 'moderation',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    ownerOnly: false,
    usage: 'init',
    examples: 'init',
    description: 'Initialiser les bases de donnée.',

    async runInteraction(client, interaction){
        let profs, matiere, devoir, guildList;

//Create tables

        profs = `CREATE TABLE IF NOT EXISTS profs(id  INTEGER PRIMARY KEY AUTOINCREMENT,
                                                  first_name TEXT,
                                                  last_name TEXT,
                                                  email TEXT
                 );`;
        matiere = `CREATE TABLE IF NOT EXISTS matiere(id  INTEGER PRIMARY KEY AUTOINCREMENT,
                                                name TEXT,
                                                profid INTEGER,
                                                FOREIGN KEY(profid) REFERENCES profs(id)
                                                );`;

        devoir = `CREATE TABLE IF NOT EXISTS devoir(id INTEGER PRIMARY KEY AUTOINCREMENT,
                                            devoir_type TEXT,
                                            comment TEXT,
                                            associate TEXT,
                                            matiereid INTEGER,
                                            date INT,
                                            FOREIGN KEY(matiereid) REFERENCES matiere(id)
                                            );`;
        guildList = `CREATE TABLE IF NOT EXISTS guild_list(id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                guild_id INTEGER,
                                                guild_name TEXT);`

        db.run(profs);
        db.run(matiere);
        db.run(devoir);
        db.run(guildList)

        let response;
        response = 'Les requêtes ont bien été éxécuté\n'

        db.all(`SELECT * FROM guild_list WHERE guild_id = ${interaction.guild.id}`, [], (err, results) =>{
            if (results.length === 0){
                db.run(`insert into guild_list(guild_id, guild_name) VALUES (${interaction.guild.id}, \'${interaction.guild.name}\')`)
                response += 'La guild id à bien été ajouter a la base'
            }else{
                response += 'La guild est déja présente dans la base de donnée'
            }
            interaction.reply({ content: response, ephemeral: true })
        })
    }
};