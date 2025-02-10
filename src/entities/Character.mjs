import ResourcePool from '../systems/ResourcePool.mjs'
import LevelingSystem from '../systems/LevelingSystem.mjs'

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
}