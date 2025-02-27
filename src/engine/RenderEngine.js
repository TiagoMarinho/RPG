export default class RenderEngine {
	EMPTY_CELL_ASCII_REPRESENTATION = " ."
	size = { width: 50, height: 15 } // this should go to a Map/Level/Environment/Board class
	getASCIIRender (entities) {
	
		// draw empty board
		const frameBuffer = []
		for (let y = 0; y < this.size.height; ++y)
			frameBuffer[y] = new Array(this.size.width).fill(this.EMPTY_CELL_ASCII_REPRESENTATION)
	
		// draw entities
		for (const entity of entities) {

			// skip if out-of-bounds
			if (entity.position.x < 0 || entity.position.x >= this.size.width ||
				entity.position.y < 0 || entity.position.y >= this.size.height)
				continue

			frameBuffer[entity.position.y][entity.position.x] = entity.ASCII_REPRESENTATION
		}
	
		return frameBuffer.map(line => line.join(``)).join(`\n`)
	}
	static requestAnimationFrame (callback) {
		setTimeout(callback, 1000/30)
	}
}