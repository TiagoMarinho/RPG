import { EventEmitter } from "events";

const defaults = {
	MAX: 100,
};

interface ResourcePoolEvents {
	POOL_CHANGED: string;
}

export default class ResourcePool {
	private amount: number = defaults.MAX;
	private max: number;
	private min: number = 0;
	public emitter: EventEmitter = new EventEmitter();

	static EVENTS: ResourcePoolEvents = {
		POOL_CHANGED: "pool changed",
	};

	constructor(max: number = defaults.MAX) {
		this.max = max;
	}
}
