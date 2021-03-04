const { DeckEncoder } = require('runeterra');
const Discord = require('discord.js');

//Borzasztó nagy barkácsolás, fix it later as usual
const data = require('./../data/set1-en_us.json').concat(require('./../data/set2-en_us.json')).concat(require('./../data/set3-en_us.json')).concat(require('./../data/set4-en_us.json'));
//const globals = require('./../data/keywords.json');

module.exports = {
    name: 'deck',
    description: 'Display deck from deck code',
    execute(message, args) {
        if (!args.length) {
            return message.channel.send(`Please provide a deck code, ${message.author}!`);
        }

        let deck = null;
        let formattedDeck = [];
        let isSingleton = true;

        try {
            //TODO: Create own deck decoder
            deck = DeckEncoder.decode(args[0]);
        } catch(err) {
            return message.channel.send(`Please provide a valid deck code, ${message.author}!`);
        }

        for (const decodedCard of deck) {
            /*if (decodedCard.code.includes("undefined")) {
                decodedCard.code = decodedCard.code.replace("undefined", "MT");
            }*/
            console.log(decodedCard);

            let card = data.find(elem => elem.cardCode == decodedCard.code);
            if(card == undefined) return message.channel.send(`Please provide a valid deck code, ${message.author}!`);
            formattedDeck.push({cost: card.cost,
                                name: card.name,
                                count: decodedCard.count,
                                type: getCardType(card.rarity, card.type),
                                rarity: card.rarity,
                                region: card.region });
            
            isSingleton = isSingleton && decodedCard.count == 1;
        }

        formattedDeck.sort(sortByCost);

        let embed = new Discord.MessageEmbed();
        embed.addField("Deck Details", createDetailsText(formattedDeck, isSingleton));
        
        let cardTypes = [
            {name: "Champion", isInline: true},
            {name: "Unit", isInline: true},
            {name: "Spell", isInline: true},
            {name: "Landmark", isInline: false}
        ];

        cardTypes.forEach(function(type) {
            let filteredDeck = formattedDeck.filter(a => a.type == type.name);
            if(filteredDeck.length > 0) embed.addField(type.name + "s", createDeckText(filteredDeck, isSingleton), type.isInline);
        });

        return message.channel.send(embed);
    },
};

function createDetailsText(deck, isSingleton) {
    let details = [];
    details.push("**Regions:** " + createRegionsText(deck.map(a => a = a.region)));
    let deckcost = 0;
    for(const card of deck) {
        deckcost += getCardCraftingCost(card.rarity.toLowerCase()) * card.count;
    }
    details.push("**Deck cost:** " + deckcost + " Shard");
    details.push("**Deckbuilding rule:** " + (isSingleton ? "Singleton" : "Normal"));
    return details.join('\n');
}

function createRegionsText(deckRegions) {
    let regions = deckRegions.filter(function(value, index, self) {
        return self.indexOf(value) === index;
    });
    return regions.join(', ');
}

function createDeckText(deckArray, isSingleton) {
    let toRet = [];
    deckArray.forEach(function(elem){
        toRet.push(elem.name + (isSingleton ? "" : " (x" + elem.count + ")"));
    });
    return toRet.join('\n');
}

function sortByCost(a,b) {
    var x = a.cost; var y = b.cost;
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

function getCardCraftingCost(rarity) {
    switch(rarity){
        case "common": return 100;
        case "rare": return 300;
        case "epic": return 1200;
        case "champion": return 3000;
    }
}

function getCardType(rarity, type){
    if(rarity == "Champion" && type == "Unit") return "Champion";
    return type;
}