export const removeDuplicates = (obj, key) => {
    const seenKeys = new Set();
    return obj.filter((item) => {
      const itemKey = item[key];
      if (!seenKeys.has(itemKey)) {
        seenKeys.add(itemKey);
        return true;
      }
      return false;
    });
  };
  