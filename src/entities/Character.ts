import LevelingSystem from "../systems/LevelingSystem";

class Character {
	private levelingSystem: LevelingSystem;

	constructor() {
		this.levelingSystem = new LevelingSystem();
	}

	getLevel(): number {
		return this.levelingSystem.getLevel();
	}

	addExperience(amount: number): void {
		this.levelingSystem.addExperience(amount);
	}
}

export default Character;
