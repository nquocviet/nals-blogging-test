export const isObject = (obj: Record<string, any>): boolean => {
  return (
    obj === Object(obj) && !Array.isArray(obj) && typeof obj !== 'function'
  );
};

export const trimDataObject = (
  obj: Record<string, any>
): Record<string, any> => {
  return Object.entries(obj).reduce((previous, [key, value]: [string, any]) => {
    if (Array.isArray(value)) {
      return {
        ...previous,
        [key]: value.map((val) =>
          isObject(val) ? trimDataObject(val) : val.trim()
        )
      };
    }

    if (isObject(value)) {
      return {
        ...previous,
        [key]: trimDataObject(value)
      };
    }

    return {
      ...previous,
      [key]: typeof value === 'string' ? value?.trim() : value
    };
  }, {});
};
