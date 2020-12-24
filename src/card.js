const Discord = require('discord.js');
const data = require('./../data/set1.json').concat(require('./../data/set2.json')).concat(require('./../data/set3.json'));

module.exports = {
    name: 'card',
    description: 'Find card image by name',
    execute(message, args) {

        let cards = findCardByName(args.join(' ').toLowerCase());
        if(cards.length == 0) return message.channel.send("This card does not exist!");

        cards.forEach(function(card){
            let embed = new Discord.MessageEmbed();
            embed.setImage(card);
            message.channel.send(embed);
        });
    }
};

function findCardByName(name){
    let toRet = [];
    for (const card of data) {
        if (card.name.toLowerCase() == name) {
           toRet.push(card.assets[0].gameAbsolutePath);
        }
    }
    return toRet;
}