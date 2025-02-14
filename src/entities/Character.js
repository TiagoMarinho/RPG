import ResourcePool from '../systems/ResourcePool.js'
import LevelingSystem from '../systems/LevelingSystem.js'

const baseStats = {
	MAX_HEALTH: 100,
	MAX_MANA: 50,
	DAMAGE: 10
}
export default class Character {
	health = new ResourcePool(baseStats.MAX_HEALTH)
	mana = new ResourcePool(baseStats.MAX_MANA)

	level = new LevelingSystem()

	baseDamage = baseStats.DAMAGE

	skills = new Array(6).fill(null)

	equips = {
		weapon: null,
		armor: null,
		pickaxe: null
	}

	gold = 0

	equipPickaxe(item) {
		if (typeof item.miningPower !== 'number') {
			return console.log(`Can't equip item "${item.name}" as pickaxe.`)
		}

		this.equips.pickaxe = item
	}
}