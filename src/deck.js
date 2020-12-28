const { DeckEncoder } = require('runeterra');
const Discord = require('discord.js');

//Borzasztó nagy barkácsolás, fix it later as usual
const data = require('./../data/set1.json').concat(require('./../data/set2.json')).concat(require('./../data/set3.json'));
//const globals = require('./../data/keywords.json');

module.exports = {
	name: 'deck',
	description: 'Display deck from deck code',
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

		for (const card of deck) {
			if (card.code.includes("undefined")) {
				card.code = card.code.replace("undefined", "MT");
			}

			let cardData = findCard(card.code, card.count);
			formattedDeck.push(cardData);
		}

		formattedDeck.sort(sortByCost);
		let detailsText = createDetailsText(formattedDeck);

		embed.addField("Deck Details", detailsText);
		if(formattedDeck.filter(a => a.rarity == "Champion").length > 0){
			embed.addField("Champions", createDeckText(formattedDeck.filter(a => a.rarity == "Champion")), true);
		}
		if(formattedDeck.filter(a => a.type == "Unit" && a.rarity != "Champion").length > 0){
			embed.addField("Units", createDeckText(formattedDeck.filter(a => a.type == "Unit" && a.rarity != "Champion")), true);
		}
		if(formattedDeck.filter(a => a.type == "Spell").length > 0){
			embed.addField("Spells", createDeckText(formattedDeck.filter(a => a.type == "Spell")), true);
		}
		if(formattedDeck.filter(a => a.type == "Landmark").length > 0){
			embed.addField("Landmarks", createDeckText(formattedDeck.filter(a => a.type == "Landmark")));
		}
		message.channel.send(embed);
	},
};

function findCard(code, count){
	for (const card of data) {
        if (card.cardCode == code) {
		   return {cost: card.cost, name: card.name, count: count, type: card.type, rarity: card.rarity, region: card.region};
       }
	}
	return null;
}

function createDetailsText(deck){
	let details = [];
	details.push("**Regions:** " + createRegionsText(deck.map(a => a = a.region)));
	let deckcost = 0;
	for(const card of deck){
		deckcost += getCardCost(card.rarity.toLowerCase()) * card.count;
	}
	details.push("**Deck cost:** " + deckcost + " Shard");
	return details.join('\n');
}

function createRegionsText(deckRegions){
	let regions = deckRegions.filter(function(value, index, self) {
		return self.indexOf(value) === index;
	});
	return regions.join(', ');
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

function getCardCost(rarity){
    switch(rarity){
        case "common": return 100;
        case "rare": return 300;
        case "epic": return 1200;
        case "champion": return 3000;
    }
}