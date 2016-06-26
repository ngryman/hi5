# hi5

> Lightweight type checker for bros :raised_hands:.

[![travis][travis-image]][travis-url] [![codecov][codecov-image]][codecov-url]

[travis-image]: https://img.shields.io/travis/ngryman/hi5.svg?style=flat
[travis-url]: https://travis-ci.org/ngryman/hi5
[codecov-image]: https://img.shields.io/codecov/c/github/ngryman/hi5.svg
[codecov-url]: https://codecov.io/github/ngryman/hi5


**hi5** checks values against types, that's it, yup.

It's meant to be used for function arguments validation and avoid errors related to a lack of
type checking. That's why you can [guard](#guard-function) functions to release some burden.

## Install

```bash
npm install --save hi5
```

## Usage

### Simple check

```javascript
function add(a, b) {
  hi5(a, 'a', Number)
  hi5(b, 'b', Number)

  return a + b
}

add(1, 2)   // => 3
add('1', 2) // Error
```

### Multiple types check

```javascript
function display(val) {
  hi5(val, 'val', [String, Number])
  console.log(val)
}

display(1)    // => 1
display('1')  // => '1'
display({})   // Error
```

### Optional arguments

```javascript
function display(val, options) {
  hi5(val, 'val', [String, Number])
  hi5.optional(options, 'options', Object)
  // [...]
  console.log(val)
}

display(1)                    // => 1
display(1, { color: 'red' })  // => 1
display(1, 2)                 // Error
```

### Guard function

```javascript
function add(a, b) {
  return a + b
}

const guardedAdd = hi5.guard(add, [
  [ 'a', Number ],
  [ 'b', Number ]
])

guardedAdd(1, 2)   // => 3
guardedAdd('1', 2) // Error
```

## Tips

### Guard on export

```javascript
const hi5 = require('hi5')

function add(a, b) {
  return a + b
}

module.exports = hi5.guard(add, [
  [ 'a', Number ],
  [ 'b', Number ]
])
```

### Rest parameters

```javascript
function add(...args) {
  args.forEach((arg, i) => hi5(arg, `arg[${i}]`, [Number, String]))

  // [...]
}
```

## License

MIT © [Nicolas Gryman](http://ngryman.sh)
