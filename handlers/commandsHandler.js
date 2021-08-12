/**
 * Loads the bot commands
 * @param {Object} client The bot client
 */
const loadCommands = async (client) => {
	createCommand(client, 'prices', 'Gets the current SLP (Smooth love potion) price!', []);

	createCommand(client, 'slp', 'Tells you how much money you have in SLP', [{
		name: 'amount',
		type: 'INTEGER',
		description: 'How many SLPs do you have at this moment?',
		required: true,
	}]);

	createCommand(client, 'ping', 'Checks my heartbeat', []);

	createCommand(client, 'source', 'Get my source code (written by wyvern800)', []);

	createCommand(client, 'help', 'Get some help about interacting with me', []);
};

/**
 * Creates the bot command
 * @param {Object} client The bot client
 * @param {String} name The command name
 * @param {String} description The command description
 * @param {Array} options The options array | can be empty for no options at all
 */
const createCommand = async (client, name, description, options) => {
	const data = {
		name: name,
		description: description,
		options,
	};

	// await await client.application.commands.create(data);
	// eslint-disable-next-line no-unused-vars

	const command = await client.application.commands.create(data);

	/* const command = await client.guilds.cache
		.get(process.env.GUILD_ID)
		.commands.create(data);*/
};

export {
	createCommand, loadCommands,
};