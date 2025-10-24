type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassArray
  | ClassDictionary;

interface ClassDictionary {
  [id: string]: boolean | null | undefined;
}

type ClassArray = Array<ClassValue>;

export function cn(...classes: ClassValue[]): string {
  let result = '';

  for (let i = 0; i < classes.length; i++) {
    const value = classes[i];
    if (!value) continue;

    if (typeof value === 'string' || typeof value === 'number') {
      result += result ? ` ${value}` : `${value}`;
    } else if (Array.isArray(value)) {
      const inner = cn(...value);
      if (inner) {
        result += result ? ` ${inner}` : inner;
      }
    } else if (typeof value === 'object') {
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key) && value[key]) {
          result += result ? ` ${key}` : key;
        }
      }
    }
  }

  return result;
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function formatString(template: string, ...args: unknown[]): string {
  return template.replace(/{(\d+)}/g, (match, index) => {
    return typeof args[Number(index)] !== 'undefined'
      ? String(args[Number(index)])
      : match;
  });
}
