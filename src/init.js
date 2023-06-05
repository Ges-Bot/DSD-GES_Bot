const sqlite3 = require("sqlite3").verbose();
//connexion
const db = new sqlite3.Database("./src/DB/bot.db", sqlite3.OPEN_READWRITE, (err) =>{
    if(err) return console.log(err.message);
} );

let profs, matiere;


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

db.run(profs);
db.run(matiere);