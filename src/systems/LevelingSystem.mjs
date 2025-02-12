import { EventEmitter } from 'events'
import { clamp } from '../utilities/math.mjs'

const defaults = {
	EXPERIENCE_PER_LEVEL: 1000,
	MINIMUM_LEVEL: 1,
	MAXIMUM_LEVEL: 100,
}

export default class LevelingSystem {

	#experience
	#level // fractional
	emitter = new EventEmitter()

	static events = {
		LEVEL_CHANGED: 'level changed',
	}

	constructor (
		experiencePerLevel = defaults.EXPERIENCE_PER_LEVEL, 
		minimumLevel = defaults.MINIMUM_LEVEL, 
		maximumLevel = defaults.MAXIMUM_LEVEL,
	) {
		this.EXPERIENCE_PER_LEVEL = experiencePerLevel
		this.MINIMUM_LEVEL = minimumLevel
		this.MAXIMUM_LEVEL = maximumLevel

		this.#experience = this.getExperienceFromLevel(this.MINIMUM_LEVEL)
		this.#level = this.MINIMUM_LEVEL
	}

	get level () {
		return Math.floor(this.#level)
	}

	get experience () {
		return this.#experience
	}

	set experience (experience) {
		const oldLevel = this.level

		this.#experience = experience
		const newLevel = this.getLevelFromExperience(experience)
		this.#level = clamp(newLevel, this.MINIMUM_LEVEL, this.MAXIMUM_LEVEL)

		if (newLevel === oldLevel) // don't emit event if experience didn't actually change
			return

		const eventData = { oldLevel, newLevel: this.level }
		this.emitter.emit(LevelingSystem.events.LEVEL_CHANGED, eventData)
	}

	getLevelFromExperience (experience = this.#experience) {
		return this.MINIMUM_LEVEL + (experience / this.EXPERIENCE_PER_LEVEL)
	}

	getExperienceFromLevel (level = this.#level) {
		return (level - this.MINIMUM_LEVEL) * this.EXPERIENCE_PER_LEVEL
	}
}