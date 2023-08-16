const sqlite3 = require("sqlite3").verbose();
//connexion
const db = new sqlite3.Database(process.env.DB_LOCATION, sqlite3.OPEN_READWRITE, (err) =>{
    if(err) return console.log(err.message);
} );

const {PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'testvalue',
    category: 'moderation',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    ownerOnly: false,
    usage: 'testvalue',
    examples: 'testvalue',
    description: 'Ajouter un jeux de valeur pour le test.',

    async runInteraction(client, interaction){
        let profs, matiere;


//Create tables

        profs = `INSERT INTO profs(first_name,last_name,email) VALUES
                 ('Mohamed','BADAOUI', 'mohamed.badaoui13@gmail.com'),
                 ('Esther','NALDA', 'enalda@myges.fr'),
                 ('Sébastien','BITTON', 's.bitton@eductive.fr'),
                 ('Régis','ABEILLE', 'rabeille@myges.fr'),
                 ('Jack','FONTANGE', 'jfontange@myges.fr'),
                 ('Erika','DELOBELLE', 'edelobelle@myges.fr'),
                 ('Bertrand','DAVAL', 'bdaval1@myges.fr'),
                 ('Christine','LENOIR', 'Christine.THUILLATLENOIR@bpce-it.fr'),
                 ('Martin','VERILHAC', 'vmartin34@myges.fr')`;

        matiere =`INSERT INTO matiere(name, profid) VALUES
                  ('Algorithmique et structure de données',1),
                  ('Anglais 1 : informatique, expression orale et écrite',2),
                  ('Architecture des réseaux',3),
                  ('Langage SQL',1),
                  ('Architectures web',4),
                  ('Bases de l''administration Windows',5),
                  ('Développement web : html, css et php',6),
                  ('Circuits logiques et architecture d''un ordinateur',7),
                  ('Langage C',7),
                  ('Projet Annuel',7),
                  ('Méthodologie et développement personnel',8),
                  ('Virtualisation serveur et stockage',9) `;

        db.run(profs);
        db.run(matiere);
        interaction.reply({ content: 'Le jeu de donné de test a bien été ajouter', ephemeral: true })
    }
};