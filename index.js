const fs = require('fs');

// require the needed discord.js classes
const dotenv = require('dotenv');
const { Client, Collection, Intents } = require('discord.js');

// Configs the dotenv
dotenv.config();

// create a new Discord client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Create commands list and load it
client.commands = new Collection();

const commandFiles = fs
	.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// when the client is ready, run this code once
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

// Creates the interactions
client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	if (!client.commands.has(interaction.commandName)) return;

	try {
		await client.commands.get(interaction.commandName).execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true,
		});
	}
});

// login to Discord with your app's token
client.login(process.env.TOKEN);
