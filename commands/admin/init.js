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
    options: [
        {
            name: 'valeur_par_defaut',
            description: 'Ajouter des valeurs par défaut',
            type: ApplicationCommandOptionType.Number,
            required: false,
            choices: [
                {
                    name: "oui",
                    value: 1
                },
                {
                    name: "non",
                    value: 0
                }
            ]
        }
    ],

    async runInteraction(client, interaction){
        let profs, matiere, devoir, guildList, guildConfig;

//Create tables

        profs = `CREATE TABLE profs(id  INTEGER PRIMARY KEY AUTOINCREMENT,
                 first_name TEXT,
                 last_name TEXT,
                 email TEXT
                 );`;
        matiere = `CREATE TABLE matiere(id  INTEGER PRIMARY KEY AUTOINCREMENT,
                   name TEXT,
                   profid INTEGER,
                   guildid INTEGER,
                   FOREIGN KEY(profid) REFERENCES profs(id),
                   FOREIGN KEY(guildid) REFERENCES guild_list(guild_id)
                   );`;

        devoir = `CREATE TABLE IF NOT EXISTS devoir(id INTEGER PRIMARY KEY AUTOINCREMENT,
                  devoir_type TEXT,
                  comment TEXT,
                  associate TEXT,
                  matiereid INTEGER,
                  date INT,
                  guildid INTEGER,
                  FOREIGN KEY(matiereid) REFERENCES matiere(id),
                  FOREIGN KEY(guildid) REFERENCES guild_list(guild_id)
                  );`;

        guildList = `CREATE TABLE IF NOT EXISTS guild_list(id INTEGER PRIMARY KEY AUTOINCREMENT,
                     guild_id TEXT,
                     guild_name TEXT);`

        guildConfig = `CREATE TABLE IF NOT EXISTS guild_config(id INTEGER PRIMARY KEY AUTOINCREMENT,
                        guildid INTEGER,
                        channel_devoir_id TEXT,
                        FOREIGN KEY(guildid) REFERENCES guild_list(guild_id)
)`

        const defaultValue = interaction.options.getNumber('valeur_par_defaut') === 1;
        var response = 'Fonction init éxécuter';
        db.run(guildList)
        db.run(profs,(err =>{
            if (err === null){
                if(defaultValue) return addProf()
            }
        }));

        db.all(`SELECT * FROM guild_list WHERE guild_id = ${interaction.guild.id}`, [], (err, results) =>{
            if (results.length === 0){
                db.run(`insert into guild_list(guild_id, guild_name) VALUES (${interaction.guild.id}, \'${interaction.guild.name}\')`)
                response += '\nLa guild id à bien été ajouter a la base'

                db.get(`SELECT * FROM guild_list WHERE guild_id = ${interaction.guild.id}`, (err, idGuildId)=>{
                    db.run(matiere,(err =>{
                        if (err === null){
                            if(defaultValue) return addMatiere(idGuildId.id)
                        }
                    }));
                })

            }else{
                db.run(matiere,(err =>{
                    if (err === null){
                        if(defaultValue) return addMatiere(results[0].id)
                    }
                }));
                response += '\nLa guild est déja présente dans la base de donnée'
            }
            db.run(guildConfig)
            db.run(devoir);

            if (defaultValue) {
                response +='\nLes valeurs par défaut ont bien été ajoutées';
            }

            interaction.reply({ content: response, ephemeral: true })
        })
    }
};

function addProf(){
    let profs
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
    db.run(profs);
}
function addMatiere(idGuildId){
    let matieres
    matieres =`INSERT INTO matiere(name, profid,guildid) VALUES
               ('Algorithmique et structure de données',1,${idGuildId}),
               ('Anglais 1 : informatique, expression orale et écrite',2,${idGuildId}),
               ('Architecture des réseaux',3,${idGuildId}),
               ('Langage SQL',1,${idGuildId}),
               ('Architectures web',4,${idGuildId}),
               ('Bases de l''administration Windows',5,${idGuildId}),
               ('Développement web : html, css et php',6,${idGuildId}),
               ('Circuits logiques et architecture d''un ordinateur',7,${idGuildId}),
               ('Langage C',7,${idGuildId}),
               ('Projet Annuel',7,${idGuildId}),
               ('Méthodologie et développement personnel',8,${idGuildId}),
               ('Virtualisation serveur et stockage',9,${idGuildId}) `;
    db.run(matieres);
}