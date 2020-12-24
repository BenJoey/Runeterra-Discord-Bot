const Discord = require('discord.js');
const keywordsdb = require('./../data/keywords.json');

module.exports = {
	name: 'keyword',
	description: 'Get keyword description',
	execute(message, args) {
    if (!args.length) {
        return message.channel.send(`Please provide a valid keyword, ${message.author}!`);
    }
    let embed = new Discord.MessageEmbed();
    let result = findKeyWord(args.join(' ').toLowerCase());
    if(result == null) return message.channel.send(`Please provide a valid keyword, ${message.author}!`);
    
    embed.addField(args.join(' '), result);
    message.channel.send(embed);
  }
};

function findKeyWord(name){
    for (var i = 0; i < keywordsdb.vocabTerms.length; i++) {
        if (keywordsdb.vocabTerms[i].name.toLowerCase() == name) {
           return keywordsdb.vocabTerms[i].description;
        }
    }
    for (var i = 0; i < keywordsdb.keywords.length; i++) {
        if (keywordsdb.keywords[i].name.toLowerCase() == name) {
           return keywordsdb.keywords[i].description;
        }
    }
    return null;
}
