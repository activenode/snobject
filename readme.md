# object-validator-light
A promise-based, lightweight object validator.

## Usage
Note that the validator freezes the validation specification object using `Object.freeze` to avoid unwanted side effects.
```
createValidator = require('light-json-valdiator)
validateObjectUsingMySpecifcation = createValidator(mySpecification)
validateObjectUsingMySpecifcation(myObject).then(mySuccessHandler).catch(myErrorHandler)
```
