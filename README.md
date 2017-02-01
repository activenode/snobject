# snobject
A promise-based, lightweight object validator that makes use of jsonpointer to use flat-hierarchy access of data (like XPath).

## Usage
Note that the validator freezes the validation specification object using `Object.freeze` to avoid unwanted side effects.
```
createValidator = require('snobject')

var objectToValidate = {
  'foo': {
    'bar': {
      'xyz': 'foobar'
    }
  },
  'paramX': /^my-regex$/,
  'paramY': [
    1,2,3
  ]
};

var myValidator = createValidator({
  '/foo/bar/xyz': {
    required: true,
    type: 'String'
  },
  '/paramX': {
    required: false,
    type: 'RegExp'
  },
  '/paramY': {
    type: 'Array',
    required: true,
    validate: function(value, __) {
      if (value.indexOf(2) == -1) {
        return Promise.reject(__('The entry `2` is not in your array ?path')); //__ will replace ?path with the corresponding name
      } 
      
      return Promise.resolve();
    }
  }
});
```
