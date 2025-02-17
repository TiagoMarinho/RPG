import Character from '../entities/Character.js'
import readline from 'readline'
import { wait } from '../utilities/time.js'
import { randomRange } from '../utilities/random.js'
import items from '../data/itemData.json' assert {type: 'json'}
import { cl } from '../utilities/log.js'

const main = async () => {
	const character = new Character()
	
	character.equipItem(items['wood_pickaxe'])

	let running = true
	while (running) {
		const action = await displayActions()
		
		switch (action) {
			case '1':
				await doNothing()
				break
			case '2':
				await goMining(character)
				break
			case '3':
				await goShopping(character)
				break
			case '4':
				await seeItemsEquipped(character)
				break
			case '5':
				console.log('\nThanks for playing!')
				running = false
				break
			default:
				console.log(`\n${cl('Invalid option, please try again.', 'red')}`)
		}
	}
	
	rl.close()
	process.exit(0)
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

const promptUser = (query) => new Promise((resolve) => rl.question(query, resolve))

const displayActions = async () => {
	console.log('\nWhat would you like to do?')
	console.log('1. Do nothing')
	console.log('2. Go mining')
	console.log('3. Go shopping')
	console.log('4. See items equipped')
	console.log('5. Exit game')
	
	const answer = await promptUser('Select an option (1-5): ')
	return answer
}

const displayShop = async () => {
	console.log(`\n${cl('Welcome to the shop!', 'green')}`);

	let options = [];
	let counter = 1;

	// Loop to list all existing items
	for (const itemKey in items) {
		const item = items[itemKey];
		console.log(`${counter}. Buy ${cl(item.name, 'blue')} (${cl(item.value + ' gold', 'yellow')})`);
		options.push(itemKey);
		counter++;
	}

	console.log(`${counter}. Exit shop`);
	options.push('exit'); // Add an "exit" option

	const answer = await promptUser(`Select an option (1-${counter}): `);

	const numAnswer = parseInt(answer);

	if (isNaN(numAnswer) || numAnswer < 1 || numAnswer > counter) {
		console.log('\nInvalid option, please try again.');
		return null;
	}

	if (numAnswer === counter) {
		return 'exit';
	}

	return options[numAnswer - 1]; // Return the item key or "exit"
};


const doNothing = async () => {
	console.log('\nYou just stand there, doing nothing...')
	await wait(2000)
}

const goMining = async (character) => {
	if (!character.equips.pickaxe) {
		console.log("\nYou need a pickaxe to go mining!")
		await wait(2000)
		return
	}

	console.log(`\nYou currently have ${cl(character.gold + ' gold', 'yellow')}`)
	console.log(`\nMining... ${cl('(Press "q" to stop mining)', 'grey')}`)
	let isMining = true
	let sessionGold = 0

	// Pause readline during mining
	rl.pause()

	// Setup key detection
	const stdin = process.stdin
	stdin.setRawMode(true)
	stdin.resume()
	stdin.setEncoding('utf8')

	const keyListener = (key) => {
		if (key === 'q') {
			isMining = false
			console.log('\nStopping mining...')
		}
	}

	stdin.on('data', keyListener)

	while (isMining) {
		const baseMiningTime = randomRange(3000, 5000)
		const miningTime = Math.floor(baseMiningTime / character.equips.pickaxe.miningPower)
		await wait(miningTime)

		if (!isMining) break

		const goldGained = randomRange(1, 5)
		console.log(`You gained ${cl(`${goldGained} gold`, 'yellow')}!`)
		character.gold += goldGained
		sessionGold += goldGained
	}

	console.log(`\nGold gained: ${cl(`+${sessionGold}`, 'green')}`)
	console.log(`You now have: ${cl(`${character.gold} gold`, 'yellow')}`)
	await wait(3000)

	// Cleanup
	stdin.removeListener('data', keyListener)
	stdin.setRawMode(false)
	stdin.pause()

	// Resume readline for menu with clean input
	rl.resume()
	// Clear any pending input
	process.stdin.emit('keypress', '', { name: 'enter' })
}

const goShopping = async (character) => {
	let shopping = true;
	while (shopping) {
		const action = await displayShop();

		if (action === null) {
			continue;
		}

		if (action === 'exit') {
			shopping = false;
			break;
		}

		await buyItem(character, action);
	}
};

const buyItem = async (character, itemKey) => {
	const item = items[itemKey];

	if (character.gold < item.value) {
		console.log(`\nYou don't have enough gold to buy "${item.name}"`)
		await wait(1000)
		return
	}

	if (character.equips[item.type]) {
		console.log(`\nYou already have a ${item.type} equipped, are you sure you want to replace it?`)
		const answer = await promptUser('Select an option (y/n): ')
		if (answer !== 'y') return
	}
	character.gold -= item.value
	character.equipItem(item)

	console.log(`\nYou bought "${cl(item.name, 'blue')}" for ${cl(item.value, 'yellow')} gold`)
	console.log(`You now have ${cl(character.gold, 'yellow')} gold left`)
	await wait(1500)

};

const seeItemsEquipped = async (character) => {
	console.log('\nItems equipped:');
	for (const type in character.equips) {
		const item = character.equips[type];
		console.log(`${type}: ${item ? cl(item.name, 'blue') : cl('Nothing equipped', 'grey')}`);
	}
	await wait(3000);
};

// Handle Ctrl+C for the entire program
process.on('SIGINT', () => {
	console.log('\nExiting game...')
	rl.close()
	process.exit(0)
})

main()