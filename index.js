// Utility for getting nested object properties
// Similar to XPath
const jsonpointer = require('jsonpointer')

// Shorthands for Promise methods
const _reject = rejectionValue => Promise.reject(rejectionValue)
const _resolve = () => Promise.resolve()

/**
 * @function validatorMaker
 * @param schema {Object} - validation object.
 */

// toType :: Any -> String
// source: http://stackoverflow.com/a/7390612/3934396
function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

module.exports = function createValidator (schema) {
  // Assignment to schema required when createValidator receives an anonymous object
  schema = Object.freeze(schema)

  return objectToValidate => Promise.all(
        Object.keys(schema).reduce((promises, jsonPointerPath) => {
          // createErrMsg :: String -> String
          // Error message helper
          const createErrMsg = msg => {
            return msg.replace('?path', '`' + jsonPointerPath + '`')
          }

          // concatResult :: Promise -> [Promise]
          const concatResult = promise => { return promises.concat([promise]) }

          // values
          const valueToValidate = jsonpointer.get(objectToValidate, jsonPointerPath)
          const rule = schema[jsonPointerPath]
          const validate = rule.validate ? rule.validate : _resolve

          /* CASES
          * 1. rule invalid
          * 2. required field not filled
          * 3. field value not of desired type
          * 4. custom function determines value as invalid
          */

          // CASE 1: cath invalid rule: no required, no validate, no type
          if (!rule.required && !rule.validate && !rule.type) {
            return concatResult(_reject(createErrMsg('The rule for ?key is invalid. It does not define the value as required, to be of a certain type or provide a custom valditation function.')))
          }

          // CASE 2: value is not defined albeit required
          if (rule.required && !valueToValidate) {
            return concatResult(_reject(createErrMsg('?path is a required field')))
          }

          // CASE 3: type check fails
          if (rule.type && toType(valueToValidate) !== rule.type.toLowerCase()) {
            return concatResult(_reject(createErrMsg('Could not match ?path with required type `' + rule.type + '` ')))
          }

          // CASE 4: Run validation function
          // > return an array of promises
          // > note that Object.keys(obj).reduce passes the return value back as `promises` until iteration is done
          return concatResult(validate(valueToValidate, createErrMsg))
        }, []) // Initialize reductioin with an empty array which will be filled with promises
    )
}

