export function isNullOrUndefined(val: any | any[]) {
    if (Array.isArray(val)) {
        return !val.every(v => {
            return v !== null && v !== undefined;
        });
    } else {
        return val === null || val === undefined;
    }
}
