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
  const typeNames = types.map(type => (type ? type.name : '' + type))
  const msg = throwError.formatError(name, typeNames)
  throw new Error(msg)
}
throwError.formatError = formatError

/**
 * Create an equality checker.
 *
 * @param  {*} type
 * @return {function}
 */
const equals = type => value => type === value

/**
 * Create an type of checker.
 *
 * @param  {*} type
 * @return {function}
 */
const typeOf = type => value => type === typeof value

/** Map types to their corresponding checkers. */
const typeCheckers = new Map([
  [null, equals(null)],
  [undefined, equals(undefined)],
  [String, typeOf('string')],
  [Number, typeOf('number')],
  [Boolean, typeOf('boolean')],
  [Function, typeOf('function')],
  [Object, typeOf('object')],
  [Array, Array.isArray]
])

/**
 * Check a value against a list of types, throwing an error in case of failure.
 *
 * @example
 * function add(a, b) {
 *   hi5(a, 'a', Number)
 *   hi5(b, 'b', Number)
 *
 *   return (a + b)
 * }
 *
 * add(1, 2)
 * // => 3
 * add('1', 2)
 * // Error
 *
 * @param {*}      value
 * @param {string} name
 * @param {array}  types
 * @return {*}
 */
function hi5(value, name, types) {
  // make sure we have an array of types
  types = Array.isArray(types) ? types : [types]

  // test each value/type pair
  let res = false
  for (let type of types) {
    let checker = typeCheckers.get(type)
    if (!checker) {
      checker = value => value instanceof type
    }
    res |= checker(value)
  }

  // boom?!
  if (!res) {
    throwError(name, types)
  }

  return value
}

/**
 * Check a deep value with the given mapper.
 *
 * @example
 * function add(obj) {
 *   const {a, b} = hi5(obj, 'obj', ({ a, b }) => ({
 *     a: hi5(a, 'a', Number),
 *     b: hi5(b, 'b', Number)
 *   }))
 *
 *   return (a + b)
 * }
 *
 * add(1, 2)
 * // => 3
 * add()
 * // Error
 * add('1', 2)
 * // Error
 *
 * @param {objet}    obj
 * @param {string}   name
 * @param {function} mapper
 * @return {*}
 */
function deep(obj, name, mapper) {
  // call original hi5
  hi5(obj, name, Object)

  // give the control to the callee
  return mapper(obj)
}

/**
 * Check an optional value, throwing an error in case of failure.
 * It does the exact same job as `hi5` but also allows the value to either be `null` or `undefined`.
 *
 * @example
 * function add(a, b, c) {
 *   hi5(a, 'a', Number)
 *   hi5(b, 'b', Number)
 *   hi5.optional(c, 'c', Number])
 *   return (a + b + (c || 0))
 * }
 *
 * add(1, 2)
 * // === > 3
 * add(1, 2, '3')
 * // Error
 *
 * @param {*}      value
 * @param {string} name
 * @param {array}  types
 * @param {[*]}    defaultValue
 * @return {*}
 */
function optional(value, name, types, defaultValue) {
  // append optional types
  types = Array.isArray(types) ? types : [types]
  types = types.concat([null, undefined])

  // call original hi5
  return hi5.call(this, value, name, types) || defaultValue
}

/**
 * Create a guarded function that first check parameters types before executing.
 * It basically wraps `fn` prepending `hi5` invocations to check parameters againts types.
 *
 * @example
 * function add(a, b) { return a + b }
 *
 * const guardedAdd = hi5.guard(add, [
 *   [ 'a', Number ],
 *   [ 'b', Number ]
 * ])
 *
 * guardedAdd('1', 2)
 * // Error
 *
 * @param  {function} fn
 * @param  {array}    types
 * @return {function}
 */
function guard(fn, types) {
  return function() {
    types.forEach((type, i) => {
      hi5.apply(this, [arguments[i]].concat(types[i]))
    })
    return fn.apply(this, arguments)
  }.bind(this)
}

/** Expose formatError */
Object.defineProperty(hi5, 'formatError', {
  get: () => throwError.formatError,
  set: val => {
    throwError.formatError = val
  }
})

module.exports = hi5
module.exports.deep = deep
module.exports.optional = optional
module.exports.guard = guard
