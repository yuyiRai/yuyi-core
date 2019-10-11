export function boolOrParam(value, defaultValue, instance) {
  if (value === true) {
    return defaultValue
  } else if ((!instance && value !== false) || (instance && (value instanceof instance))) {
    return value
  }
  return value
}
