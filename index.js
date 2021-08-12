import dotenv from 'dotenv';
import { Client, Intents } from 'discord.js';
import { loadCommands } from './handlers/commandsHandler';
import { handleInteractions, handlePresence } from './handlers/interactionsHandler';

dotenv.config();

// require the needed discord.js classes
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// when the client is ready, run this code once
// this event will only trigger one time after logging in
client.once('ready', async () => {
	loadCommands(client);
	handlePresence(client);

	console.log('Ready!');
});

// Creates the interactions
client.on('interactionCreate', async (interaction) => {
	handleInteractions(client, interaction);
});

// login to Discord with your app's token
client.login(process.env.TOKEN);
