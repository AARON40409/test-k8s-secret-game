export const removeMultipleSpaces = (obj) => {
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = removeMultipleSpaces(obj[key]);
      }
    }
  } else if (typeof obj === 'string') {
    obj = obj.replace(/\s+/g, ' ');
  }
  return obj;
};
