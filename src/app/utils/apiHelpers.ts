export const toCamel = (s: string) => {
  return s.replace(/([-_][a-z])/gi, $1 => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
};

const toSnackCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`);

const isObject = function (o: ObjectType) {
  return o === Object(o) && !Array.isArray(o) && typeof o !== 'function';
};

export const snackToCamelCase = function (o: any): any {
  if (isObject(o)) {
    const n: ObjectType = {};

    Object.keys(o).forEach((k: string) => {
      n[toCamel(k)] = snackToCamelCase(o[k]);
    });

    return n;
  } else if (Array.isArray(o)) {
    return o.map(i => {
      return snackToCamelCase(i);
    });
  }

  return o;
};

export const camelToSnakeCase = function (o: any): any {
  if (isObject(o)) {
    const n: ObjectType = {};

    Object.keys(o).forEach((k: string) => {
      n[toSnackCase(k)] = camelToSnakeCase(o[k]);
    });

    return n;
  } else if (Array.isArray(o)) {
    return o.map(i => {
      return camelToSnakeCase(i);
    });
  }

  return o;
};
