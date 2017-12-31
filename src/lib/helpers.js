export const arrayToObject = (array, key = 'id') => {
  const object = {};

  array.forEach(element => (object[element[key]] = element));

  return object;
};
