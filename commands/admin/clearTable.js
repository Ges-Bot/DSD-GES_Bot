const sqlite3 = require("sqlite3").verbose();
//connexion
const db = new sqlite3.Database(process.env.DB_LOCATION, sqlite3.OPEN_READWRITE, (err) =>{
    if(err) return console.log(err.message);
} );

const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'droptable',
    category: 'moderation',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    ownerOnly: false,
    usage: 'droptable',
    examples: 'droptable',
    description: 'Supprimer les tables',

    async runInteraction(client, interaction){
        let profs, matiere, devoir;


//Create tables

        profs = `DROP TABLE profs`;
        matiere = `DROP TABLE matiere`;
        devoir = `DROP TABLE devoir`;

        db.run(profs);
        db.run(matiere);
        db.run(devoir);

        interaction.reply({ content: 'La base de donnée a bien été vidé', ephemeral: true })
    }
};