const Discord = require('discord.js');
const data = require('./../data/set1.json').concat(require('./../data/set2.json')).concat(require('./../data/set3.json'));

module.exports = {
	name: 'card',
	description: 'Find card by name',
	execute(message, args) {

        let cards = findCardByName(args.join(' ').toLowerCase());
        if(cards.length == 0) return;

        cards.forEach(function(card){
            let embed = new Discord.MessageEmbed();
            embed.setImage(card.assets[0].gameAbsolutePath);
            /*embed.addField("Name", card.name, true);
            embed.addField("Cost", card.cost, true);
            embed.addField("Type", card.type, true);
            embed.addField("Region", card.region, true);
            console.log(card.assets[0].gameAbsolutePath)*/
            message.channel.send(embed);
        });
    }
};

function findCardByName(name){
    let toRet = [];
	for (var i = 0; i < data.length; i++) {
        if (data[i].name.toLowerCase() == name) {
		   toRet.push(data[i]);
       }
	}
	return toRet;
}