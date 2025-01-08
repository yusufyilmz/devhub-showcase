
export function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

export function keysToCamelCase<T>(obj: any): T {
    if (Array.isArray(obj)) {
        return obj.map(v => keysToCamelCase(v)) as unknown as T;
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((result, key) => {
            const camelKey = toCamelCase(key);
            result[camelKey] = keysToCamelCase(obj[key]);
            return result;
        }, {} as any) as T;
    }
    return obj as T;
}
