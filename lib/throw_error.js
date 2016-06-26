'use strict'

/** Vowels pattern used to properly format error message. */
const vowelsPattern = /[aeiou]/i

/**
 * Format error message.
 *
 * @param  {string} name
 * @param  {array}  typeNames
 * @return {string}
 */
const formatError = (name, typeNames) => {
  const n = vowelsPattern.test(typeNames[0][0]) ? 'n' : ''
  return `'${name}' must be a${n} ${typeNames.join(' or ')}`
}

/**
 * Throw error.
 *
 * @param {string} name
 * @param {array} types
 */
const throwError = (name, types) => {
  const typeNames = types.map(type => type ? type.name : '' + type)
  const msg = throwError.formatError(name, typeNames)
  throw new Error(msg)
}
throwError.formatError = formatError

module.exports = throwError
