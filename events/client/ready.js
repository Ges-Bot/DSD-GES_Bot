const {ActivityType } = require("discord.js");
const Logger = require("../../utils/Logger");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        let guildsCount = await client.guilds.fetch();

        client.user.setPresence({ activities: [{ name: "La classe", type: ActivityType.Watching }], status: "online" });

        await client.application.commands.set(client.commands.map(cmd => cmd));
        Logger.client(`Bot ready on ${guildsCount.size} servers\n\n--------\nGesBot ©2023\n--------\nAuthor:\n-Silvus\n-Weaves\n--------\n`);
    },
};
