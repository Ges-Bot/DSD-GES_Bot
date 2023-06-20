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
        let profs, matiere, devoir;


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

        db.run(profs);
        db.run(matiere);
        db.run(devoir);
        interaction.reply({ content: 'La base de donnée a bien été mise à jour', ephemeral: true })
    }
};