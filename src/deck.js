const { DeckEncoder } = require('runeterra');
const Discord = require('discord.js');

//Borzasztó nagy barkácsolás, fix it later as usual
const data = require('./../data/set1.json').concat(require('./../data/set2.json')).concat(require('./../data/set3.json'));

module.exports = {
	name: 'deck',
	description: 'Check deck code',
	execute(message, args) {
        if (!args.length) {
			return message.channel.send(`Please provide a deck code, ${message.author}!`);
		}

		let embed = new Discord.MessageEmbed();
		let deck = null;
		let formattedDeck = [];

		try {
			//TODO: Create own deck decoder
			deck = DeckEncoder.decode(args[0]);
		} catch(err) {
			return message.channel.send(`Please provide a valid deck code, ${message.author}!`);
		}

		for (var i = 0; i < deck.length; i++) {
			if (deck[i].code.includes("undefined")) {
				deck[i].code = deck[i].code.replace("undefined", "MT");
			}

			let card = findCard(deck[i].code, deck[i].count);
			formattedDeck.push(card);
		}

		formattedDeck.sort(sortByCost);
		
		if(formattedDeck.filter(a => a.rarity == "Champion").length > 0){
			embed.addField("Champions", createDeckText(formattedDeck.filter(a => a.rarity == "Champion")));
		}
		if(formattedDeck.filter(a => a.type == "Landmark").length > 0){
			embed.addField("Landmarks", createDeckText(formattedDeck.filter(a => a.type == "Landmark")));
		}
		if(formattedDeck.filter(a => a.type == "Unit" && a.rarity != "Champion").length > 0){
			embed.addField("Units", createDeckText(formattedDeck.filter(a => a.type == "Unit" && a.rarity != "Champion")));
		}
		if(formattedDeck.filter(a => a.type == "Spell").length > 0){
			embed.addField("Spells", createDeckText(formattedDeck.filter(a => a.type == "Spell")));
		}
		message.channel.send(embed);
	},
};

function findCard(code, count){
	for (var i = 0; i < data.length; i++) {
        if (data[i].cardCode == code) {
		   return {cost: data[i].cost, name: data[i].name, count: count, type: data[i].type, rarity: data[i].rarity};
       }
	}
	return null;
}

function sortByCost(a,b){
	var x = a.cost; var y = b.cost;
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

function createDeckText(deckArray){
	let toRet = "";
	deckArray.forEach(function(elem){
		toRet += elem.name + " (x" + elem.count + ")\n";
	});
	return toRet;
}