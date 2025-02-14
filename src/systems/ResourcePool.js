import { clamp } from '../utilities/math.js'
import { EventEmitter } from 'events'

const defaults = {
	MAX: 100,
}

export default class ResourcePool {
	#amount = defaults.MAX
	#max = defaults.MAX
	#min = 0
	emitter = new EventEmitter()

	static EVENTS = {
		POOL_CHANGED: 'pool changed',
	}

	constructor (max = defaults.MAX) {
		this.max = max
	}

	get amount () {
		return this.#amount
	}

	set amount (newAmount) {
		const oldAmount = this.#amount
		this.#amount = clamp(newAmount, this.#min, this.max)

		if (this.#amount !== oldAmount) 
			this.emitter.emit(this.events.POOL_CHANGED, { oldAmount, newAmount: this.#amount })
	}

	get max () {
		return this.#max
	}

	set max (newMax) {
		this.#amount *= newMax / this.#max
		this.#max = newMax
	}

	isEmpty () {
		return this.amount === this.#min
	}

	isFull () {
		return this.amount === this.max
	}

	fill () {
		this.amount = this.max
	}
}