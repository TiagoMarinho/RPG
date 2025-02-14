import Character from '../entities/Character.js'
import readline from 'readline'
import { wait } from '../utilities/time.js'
import { randomRange } from '../utilities/random.js'
import items from '../data/itemData.json' assert {type: 'json'}

const main = async () => {
	const character = new Character();
	
	character.equipPickaxe(items['wood_pickaxe']);

	let running = true;
	while (running) {
		const action = await displayActions();
		
		switch (action) {
			case '1':
				await doNothing();
				break;
			case '2':
				await goMining(character);
				break;
			case '3':
				console.log('\nThanks for playing!');
				running = false;
				break;
			default:
				console.log('\nInvalid option, please try again.');
		}
	}
	
	rl.close();
	process.exit(0);
};

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const promptUser = (query) => new Promise((resolve) => rl.question(query, resolve));

const displayActions = async () => {
	console.log('\nWhat would you like to do?');
	console.log('1. Do nothing');
	console.log('2. Go mining');
	console.log('3. Exit game');
	
	const answer = await promptUser('Select an option (1-3): ');
	return answer;
};

const doNothing = async () => {
	console.log('\nYou just stand there, doing nothing...');
	await wait(2000);
};

const goMining = async (character) => {
	if (!character.equips.pickaxe) {
		console.log("\nYou need a pickaxe to go mining!");
		await wait(2000);
		return;
	}

	console.log(`\nYou currently have ${character.gold} gold`);
	console.log('\nMining... (Press "q" to stop mining)');
	let isMining = true;
	let sessionGold = 0;

	// Pause readline during mining
	rl.pause();

	// Setup key detection
	const stdin = process.stdin;
	stdin.setRawMode(true);
	stdin.resume();
	stdin.setEncoding('utf8');

	const keyListener = (key) => {
		if (key === 'q') {
			isMining = false;
			console.log('\nStopping mining...');
		}
	};

	stdin.on('data', keyListener);

	while (isMining) {
		const baseMiningTime = randomRange(3000, 5000);
		const miningTime = Math.floor(baseMiningTime / character.equips.pickaxe.miningPower);
		await wait(miningTime);

		if (!isMining) break;

		const goldGained = randomRange(1, 5);
		console.log(`You gained ${goldGained} gold!`);
		character.gold += goldGained;
		sessionGold += goldGained;
	}

	console.log(`\nGold gained: ${sessionGold}`);
	console.log(`Total gold: ${character.gold}`);
	await wait(3000);

	// Cleanup
	stdin.removeListener('data', keyListener);
	stdin.setRawMode(false);
	stdin.pause();

	// Resume readline for menu with clean input
	rl.resume();
	// Clear any pending input
	process.stdin.emit('keypress', '', { name: 'enter' });
};

// Handle Ctrl+C for the entire program
process.on('SIGINT', () => {
	console.log('\nExiting game...');
	rl.close();
	process.exit(0);
});

main();