const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'List the commands for this bot',
	execute(message, args) {
        let embed = new Discord.MessageEmbed();
        embed.addField("!mf deck <deck-code>", " - To view the deck list of the code");
        embed.addField("!mf card <card-name>", " - To view the specified card by name");
        embed.addField("!mf keyword <keyword>", " - To view the specified keyword");

        message.channel.send(embed);
    }
};