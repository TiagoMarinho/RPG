import readline from 'readline'
import process from 'process'
import keybinds from '../data/keybinds.json' assert { type: 'json' }

class BindableAction {
	active = false
	constructor (name) {
		this.name = name
	}
}

const bindings = keybinds.map(binding => ({
	...binding,
	action: new BindableAction(binding.name)
}))

export const actionsByKey = new Map(
	bindings.map(binding => 
		binding.keys.map(key => [
			key, binding.action
		])
	).flat()
)

export const actionsByName = new Map(
	bindings.map(binding => [binding.name, binding.action])
)

export default class InputHandler {
	listen () {
		readline.emitKeypressEvents(process.stdin)
		process.stdin.setRawMode(true)
		
		process.stdin.on('keypress', (_, key) => {
			console.log(`user pressed "${key.name}"`)
			
			if (key.name === "x")
				process.exit(0)

			const action = actionsByKey.get(key.name)
			
			if (!action)
				return

			action.active = performance.now()
			console.log(`action: ${action.name}`)
		})
	}
}
