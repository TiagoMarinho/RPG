import Character from '../entities/Character.js'
import { getRandomInt } from '../utilities/random.js'
import RenderEngine from '../engine/RenderEngine.js'
import InputHandler, { actionsByName } from '../systems/InputHandler.js'
import Entity from '../entities/Entity.js'

const character = new Character()
character.position = { x: 0, y: 0 }
const renderEngine = new RenderEngine()
const entities = new Array(20).fill(null).map(_ => {
	const entity = new Entity()
	entity.position = { x: getRandomInt(0, 49), y: getRandomInt(0, 14) }
	entity.ASCII_REPRESENTATION = " ?"
	return entity
})
entities.push(character)

const main = async () => {
	gameLoop()
}

const gameLoop = _ => {
	console.clear()
	if (actionsByName.get("moveUp").active) {
		--character.position.y
		actionsByName.get("moveUp").active = false
		RenderEngine.requestAnimationFrame(main)
	}
	if (actionsByName.get("moveLeft").active) {
		--character.position.x
		actionsByName.get("moveLeft").active = false
		RenderEngine.requestAnimationFrame(main)
	}
	if (actionsByName.get("moveDown").active) {
		++character.position.y
		actionsByName.get("moveDown").active = false
		RenderEngine.requestAnimationFrame(main)
	}
	if (actionsByName.get("moveRight").active) {
		++character.position.x
		actionsByName.get("moveRight").active = false
	}
	console.log(renderEngine.getASCIIRender(entities))
	RenderEngine.requestAnimationFrame(main)
}

const inputHandler = new InputHandler()
inputHandler.listen()

main()