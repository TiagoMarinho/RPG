import Character from '../entities/Character.js'
import readline from 'readline'
import { wait } from '../utilities/time.js'
import { randomRange } from '../utilities/random.js'
import items from '../data/itemData.json' assert {type: 'json'}
import { cl } from '../utilities/log.js'
import RenderEngine from '../engine/RenderEngine.js'

const main = async () => {
	const character = new Character()
	const renderEngine = new RenderEngine()
	console.log(renderEngine.getASCIIRender([character]))
	//RenderEngine.requestAnimationFrame(main)
}

main()