const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'List the commands for this bot',
    execute(message, arg) {
        let embed = new Discord.MessageEmbed();
        embed.addField("Bot commands", `**${arg} deck <deck-code>** - To view the deck list of the code\n`+
                                    `**${arg} card <card-name>** - To view the specified card by name\n`+
                                    `**${arg} keyword <keyword>** - To view the specified keyword`);

        message.channel.send(embed);
    }
};