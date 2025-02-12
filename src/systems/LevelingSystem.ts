import { EventEmitter } from "events";

interface Defaults {
	EXPERIENCE_PER_LEVEL: number;
	MINIMUM_LEVEL: number;
	MAXIMUM_LEVEL: number;
}

const defaults: Defaults = {
	EXPERIENCE_PER_LEVEL: 1000,
	MINIMUM_LEVEL: 1,
	MAXIMUM_LEVEL: 100,
};

export default class LevelingSystem {
	private experience: number;
	private level: number; // fractional
	emitter: EventEmitter = new EventEmitter();

	static events = {
		LEVEL_CHANGED: "level changed",
	};

	getLevel(): number {
		return this.level;
	}

	addExperience(amount: number): void {
		this.experience += amount;
	}

	constructor() {
		this.experience = 0;
		this.level = defaults.MINIMUM_LEVEL;
	}
}
