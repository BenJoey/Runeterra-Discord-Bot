const Discord = require('discord.js');
const data = require('./../data/set1-en_us.json').concat(require('./../data/set2-en_us.json')).concat(require('./../data/set3-en_us.json')).concat(require('./../data/set4-en_us.json'));

module.exports = {
    name: 'card',
    description: 'Find card image by name',
    execute(message, args) {

        let cardName = args.join(' ').toLowerCase();
        let cards = data.filter(elem => elem.name.toLowerCase() == cardName);
        if(cards.length == 0) return message.channel.send("This card does not exist!");

        cards.forEach(function(card){
            let embed = new Discord.MessageEmbed();
            embed.setImage(card.assets[0].gameAbsolutePath);
            embed.setTitle(card.name);
            embed.setDescription(card.descriptionRaw);
            embed.addField("Card Details", createCardString(card));
            message.channel.send(embed);
        });
    }
};

function createCardString(card){
    let details = [];
    details.push("**Region:** " + card.region);
    details.push("**Type:** " + getCardType(card.supertype.toLowerCase(), card.type));
    details.push("**Cost:** " + card.cost);
    if(card.type == "Unit"){
        details.push("**Stats:** " + card.attack + "/" + card.health);
    }
    if(card.type == "Spell"){
        details.push("**Spell speed:** " + card.spellSpeed);
    }
    if(card.collectible){
        details.push("**Crafting cost:** " + getCraftingCost(card.rarity.toLowerCase()));
    }
    if(card.type == "Unit" && card.keywords.length){
        details.push("**Keywords:** " + card.keywords.join(', '));
    }
    details.push("**Is collectible:** " + (card.collectible ? "Yes" : "No"));

    return details.join('\n');
}

function getCraftingCost(rarity){
    switch(rarity){
        case "common": return 100;
        case "rare": return 300;
        case "epic": return 1200;
        case "champion": return 3000;
    }
}

function getCardType(rarity, type){
    if(rarity == "champion" && type == "Unit") return "Champion";
    return type;
}