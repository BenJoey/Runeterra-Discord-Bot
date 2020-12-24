module.exports = {
	name: 'ready',
	description: 'Bot is ready to use',
	execute(client) {
		client.user.setActivity("!mf help");
	}
};