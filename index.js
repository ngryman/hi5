'use strict'

const throwError = require('./lib/throw_error')
const typeCheckers = require('./lib/type_checkers')

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
 */
function hi5(value, name, types) {
  // make sure we have an array of types
  types = Array.isArray(types) ? types : [ types ]

  // test each value/type pair
  let res = false
  for (let type of types) {
    let checker = typeCheckers.get(type)
    if (!checker) {
      checker = value => (value instanceof type)
    }
    res |= checker(value)
  }

  // boom?!
  if (!res) {
    throwError(name, types)
  }
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
 */
function optional(value, name, types) {
  // append optional types
  types = Array.isArray(types) ? types : [ types ]
  types = types.concat([null, undefined])

  // call original hi5
  hi5.call(this, value, name, types)
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
  set: (val) => { throwError.formatError = val }
})

module.exports = hi5
module.exports.optional = optional
module.exports.guard = guard
