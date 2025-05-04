import keybinds from '../data/keybinds.json' with { type: "json" }

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
		
		window.addEventListener('keydown', e => {
			const keyName = e.key
			console.log(`user pressed "${keyName}"`)

			const action = actionsByKey.get(keyName)
			
			if (!action)
				return

			action.active = performance.now()
			console.log(`action: ${action.name}`)
		})
		window.addEventListener('keyup', e => {
			const keyName = e.key
			console.log(`user released "${keyName}"`)

			const action = actionsByKey.get(keyName)
			
			if (!action)
				return

			action.active = false
			console.log(`action: ${action.name}`)
		})
	}
}
