module.exports = {
    name: 'message',
    description: 'Handle received message',
    execute(message, client) {
        args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        if (command == "help") args = client.config;
        try{
            client.commands.get(command).execute(message, args);
        } catch (err) {
            return message.channel.send("Invalid command!");
        }
    }
};