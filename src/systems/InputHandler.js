import readline from 'readline'
import process from 'process'
import keybinds from '../data/keybinds.json' assert {type: 'json'}

class BindableAction {
	isDown = false
	constructor (name) {
		this.name = name
	}
}

const bindings = keybinds.map(binding => ({
	...binding,
	action: new BindableAction(binding.name)
}))

export const keyMap = new Map(
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
		
		process.stdin.on('keypress', character => {
			keyMap[character].isDown = true
		})
	}
}
