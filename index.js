const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.config = config;

const commandFiles = fs.readdirSync('./src').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./src/${file}`);
	client.commands.set(command.name, command);
}

client.on('message', message => {
    if(message.content.startsWith(config.prefix)){
        client.commands.get('message').execute(message, client);
	}
});

client.once('ready', () => {
	client.commands.get('ready').execute(client);
	setInterval(() => client.user.setActivity(`${client.config.prefix} help`), 5000);
});

client.login(config.token);

var http = require('http');

http.createServer(function (req, res) {
  res.write("I'm alive");
  res.end();
}).listen(8080);
