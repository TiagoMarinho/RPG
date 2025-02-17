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

	gold = 0

	equips = {
		weapon: null,
		armor: null,
		pickaxe: null,
		shield: null,
		consumable: null
	}

	equipItem(item) {
		if (!Object.hasOwn(this.equips, item.type)) {
			console.log(`Can't equip item "${item.name}" as it is not a valid equipment type.`);
		}

		this.equips[item.type] = item;
	}

}