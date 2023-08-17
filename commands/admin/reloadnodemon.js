const { PermissionFlagsBits } = require('discord.js');
const child = require("child_process");

module.exports = {
    name: 'reloadnodemon',
    category: 'moderation',
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    ownerOnly: false,
    usage: 'reloadnodemon',
    examples: 'reloadnodemon',
    description: 'Mettre à jour le bot',
    async runInteraction(client, interaction){
        child.exec("rs", (err, res) =>{
            if(err){
                interaction.reply({ content: `${res}`, ephemeral: true })
            }else{
                interaction.reply({ content: `\`\`\`${res.slice(0, 2000)}\`\`\``, ephemeral: true })
            }
        })

    }
};