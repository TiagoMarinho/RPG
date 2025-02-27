/**
 * Returns a random integer between min and max (inclusive)
 * @param {number} min The lower bound
 * @param {number} max The upper bound
 * @returns {number} Random integer between min and max
 */
export const getRandomInt = (min, max) =>
	Math.floor(Math.random() * (max - min + 1)) + min