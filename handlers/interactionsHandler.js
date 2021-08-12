import { emojiCharacters } from '../utils/utils';
import axios from 'axios';
import { MessageEmbed } from 'discord.js';

const api = axios.create({});

/**
 * Handles the bot interactions
 * @param {Object} client The client
 * @param {Object} interaction The interaction
 */
const handleInteractions = async (client, interaction) => {
	if (!interaction.isCommand()) return;

	switch (interaction.commandName) {
	case 'prices':
		// interaction.options.getString('arroba')
		getSlpPrice(interaction);
		break;
	case 'slp':
		calcSlp(interaction);
		break;
	case 'ping':
		interaction.reply(`Websocket heartbeat: ${client.ws.ping}ms.`);
		break;
	case 'source':
		interaction.reply({
			content:
          'My Github Repository: https://github.com/wyvern800/axie-friend-bot',
			ephemeral: true,
		});
		break;
	}
};

/**
 * Handles the bot presence
 * @param {Object} client The bot client
 */
const handlePresence = async (client) => {
	setTimeout(async () => {
		const response = await api.get(
			'https://www.gasnow.org/api/v3/gas/price?utm_source=gasnow-fetcher',
		);

		const rapid = response.data['data']['rapid'].toString();
		const fast = response.data['data']['fast'].toString();
		const standard = response.data['data']['standard'].toString();
		const slow = response.data['data']['slow'];

		client.user.setPresence({
			activities: [
				{
					name: `⚡${fast.slice(0, 2)} |🚶🏼${standard.slice(
						0,
						2,
					)} |🐢${slow.slice(0, 2)}`,
				},
			],
		});
	}, 10000);
};

/**
 * Gets the current SLP price
 * @param {Object} interaction The interaction
 */
const getSlpPrice = async (interaction) => {
	const response = await api.get(
		'https://api.coingecko.com/api/v3/coins/smooth-love-potion',
	);

	const usd = response.data['market_data']['current_price']['usd'];
	const brl = response.data['market_data']['current_price']['brl'];
	const eth = response.data['market_data']['current_price']['eth'];

	await interaction.reply({
		content: `**The prices at this moment are**: \n**USD**: ${usd} \n**ETH**: ${eth} \n**BRL**: ${brl}`,
	});
};

/**
 * Calculates the money you made out of SLP's
 * @param {Object} interaction The interaction
 */
const calcSlp = async (interaction) => {
	const amount = interaction.options.getInteger('amount');

	const response = await api.get(
		'https://api.coingecko.com/api/v3/coins/smooth-love-potion',
	);

	const usd = response.data['market_data']['current_price']['usd'];
	const brl = response.data['market_data']['current_price']['brl'];
	const eth = response.data['market_data']['current_price']['eth'];

	await interaction.reply({
		content: `**How much you made in SLP**: \n-**USD**: ${Math.trunc(
			usd * amount,
		)}$ \n-**ETH**: ${eth * amount} \n-**BRL**: R$ ${Math.trunc(
			brl * amount,
		)},00`,
		ephemeral: true,
	});
};

export { handleInteractions, handlePresence };
