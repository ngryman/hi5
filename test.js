/*eslint no-multi-spaces: [2, { exceptions: { ArrayExpression: true }}] */
import test from 'ava'
import hi5 from './'

class MyType {}

const values = [
  [null, 'null', null],
  [undefined, 'undefined', undefined],
  ['string', 'string', String],
  ['', 'string (empty)', String],
  [42, 'number', Number],
  [0, 'number (zero)', Number],
  [true, 'boolean (true)', Boolean],
  [false, 'boolean (false)', Boolean],
  [[1], 'array', Array],
  [[[]], 'array (nested)', Array],
  [[], 'array (empty)', Array],
  [new MyType(), 'custom type', MyType]
]

const testValue = value => {
  const name = value[1]
  const expectedType = value[2]

  test(`test ${name}`, t => {
    for (let i = 0; i < values.length; i++) {
      if (name === values[1]) {
        continue
      }

      const testFn = () => hi5(values[i][0], name, expectedType)
      if (expectedType === values[i][2]) {
        t.notThrows(testFn)
      }
      else {
        t.throws(testFn)
      }
    }
  })
}
values.forEach(testValue)

test('allow multiple types', t => {
  t.notThrows(() => hi5.optional(1337, '1337', [Number, String]))
  t.notThrows(() => hi5.optional('1337', '1337', [Number, String]))
})

test('allow optional shorthand', t => {
  t.notThrows(() => hi5.optional(1337, '1337', Number))
  t.notThrows(() => hi5.optional(1337, '1337', [Number, String]))
  t.notThrows(() => hi5.optional(null, '1337', Number))
  t.notThrows(() => hi5.optional(undefined, '1337', Number))
  t.throws(() => hi5.optional(0, '1337', String))
  t.throws(() => hi5.optional('', '1337', Number))
})

test('create a guarded function', t => {
  const guarded = hi5.guard(a => true, [['a', Number]])
  t.throws(() => guarded('1337'), "'a' must be a Number")
  t.notThrows(() => guarded(1337))
})

test('create a guarded function (multiple types)', t => {
  const guarded = hi5.guard(a => true, [['a', [Number, undefined]]])
  t.throws(() => guarded('1337'), "'a' must be a Number or undefined")
  t.notThrows(() => guarded())
})

test('create a guarded function (multiple arguments)', t => {
  const guarded = hi5.guard((a, b) => true, [['a', Number], ['b', Number]])
  t.throws(() => guarded(1337, '1337'), "'b' must be a Number")
})

test('accept custom error message formating', t => {
  const stdFormat = hi5.formatError
  hi5.formatError = (name, types) => `${name}: ${types.join(' or ')}`
  t.throws(() => hi5(1337, '1337', [String, null]), '1337: String or null')
  hi5.formatError = stdFormat
  t.throws(() => hi5(1337, '1337', [String, null]), "'1337' must be a String or null")
})
