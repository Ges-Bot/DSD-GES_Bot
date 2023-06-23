const sqlite3 = require("sqlite3").verbose();

//connexion
const db = new sqlite3.Database(process.env.DB_LOCATION, sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.log(err.message);
});

module.exports = {
    name: "sub-menu",
    async runInteraction(client, interaction){
        console.log(interaction.values[0])

        db.run(`DELETE FROM devoir WHERE id = ${interaction.values[0]}`);

        const embedQuestion = {
            color: 0x735B8B,
            title: 'Devoir Supprimé',
            description:` **Un devoir a bien été Supprimé**\n`,
            timestamp: new Date(),
            footer: {
                text: interaction.user.tag,
                icon_url: interaction.user.displayAvatarURL(),
            },
        };

        interaction.reply({embeds: [embedQuestion]})

    }
}