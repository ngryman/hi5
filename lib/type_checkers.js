'use strict'

/**
 * Create an equality checker.
 *
 * @param  {*} type
 * @return {function}
 */
const equals = (type) => {
  return value => type === value
}

/**
 * Create an type of checker.
 *
 * @param  {*} type
 * @return {function}
 */
const typeOf = (type) => {
  return value => type === typeof value
}

/** Map types to their corresponding checkers. */
const typeCheckers = new Map([
  [ null, equals(null) ],
  [ undefined, equals(undefined) ],
  [ String, typeOf('string') ],
  [ Number, typeOf('number') ],
  [ Boolean, typeOf('boolean') ],
  [ Function, typeOf('function') ],
  [ Object, typeOf('object') ],
  [ Array, Array.isArray ]
])

module.exports = typeCheckers
