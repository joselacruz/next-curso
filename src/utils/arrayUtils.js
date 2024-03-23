export function filterOutElementByProperty({ array, propertyName, propertyValue }) {
  const result = array.filter((element) => element[propertyName] !== propertyValue);
  return result;
}

export function isDuplicateElement({ array, propertyName, propertyValue }) {
  const result = array.some((element) => element[propertyName] == propertyValue);
  return result;
}
