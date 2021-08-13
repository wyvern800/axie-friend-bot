import { emojiCharacters } from '../utils/utils';
import axios from 'axios';
import { MessageEmbed } from 'discord.js';
import { formatNumber } from '../utils/utils';

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
	case 'help':
		interaction.reply({
			content: '**My Commands are**:\n/slp, /prices, /source, /ping',
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
	setInterval(async () => {
		const response = await api.get(
			'https://www.gasnow.org/api/v3/gas/price?utm_source=gasnow-fetcher',
		);

		const rapid = Math.round(response.data['data']['rapid']);
		const fast = Math.round(response.data['data']['fast']);
		const standard = Math.round(response.data['data']['standard']);
		const slow = Math.round(response.data['data']['slow']);

		client.user.setPresence({
			activities: [
				{
					name: `⚡${fast.toString().slice(0, 2)} |🚶🏼${standard
						.toString()
						.slice(0, 2)} |🐢${slow.toString().slice(0, 2)}`,
				},
			],
		});
	}, 5000);
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
		content: `**1x Smooth love potion cost at this moment**: -\n** USD**: ${usd}$ \n-** ETH**: ${eth} \n- **BRL**: R$ ${brl}`,
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
		content: `**${amount}x Smooth love potion${amount > 1 ? 's' : ''} cost${
			amount > 1 ? 's' : ''
		}**: \n- **USD**: ${formatNumber(usd * amount)}$ \n- **ETH**: ${
			eth * amount
		} \n- **BRL**: R$ ${formatNumber(brl * amount)}`,
		ephemeral: true,
	});
};

export { handleInteractions, handlePresence };
