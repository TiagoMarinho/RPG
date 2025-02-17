export const logColors = Object.freeze({
    blue: '\x1b[34m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    grey: '\x1b[90m',
    none: '\x1b[0m'
})

/**
 * Wraps the given text in the specified color for logging.
 * @param {string} text - The text to be logged.
 * @param {keyof typeof logColors} color - The color code to apply to the text.
 */
export const colorLogText = (text, color) => {
    color = logColors[color] ?? color
    return `${color}${text}${logColors.none}`
}

/** shortcut for colorLogText */
export const cl = colorLogText;