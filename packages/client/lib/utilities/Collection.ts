export class Collection<K, V> extends Map<K, V> {
    public at(index: number) {
        const keys = Array.from(this.keys());
        if (index < 0) index = keys.length + index;
        return this.get(keys[index]);
    }

    public find(
        fn: (value: V, key: K, collection: this) => boolean,
        thisArg?: unknown
    ) {
        if (typeof fn !== 'function')
            throw new TypeError(`${fn} is not a function`);
        if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);

        for (const [key, val] of this) {
            if (fn(val, key, this)) return val;
        }

        return undefined;
    }

    public filter(
        fn: (value: V, key: K, collection: this) => boolean,
        thisArg?: unknown
    ): Collection<K, V> {
        if (typeof fn !== 'function')
            throw new TypeError(`${fn} is not a function`);
        if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);

        const results = new Collection<K, V>();
        for (const [key, val] of this) {
            if (fn(val, key, this)) results.set(key, val);
        }

        return results;
    }

    public map<T>(
        fn: (value: V, key: K, collection: this) => T,
        thisArg?: unknown
    ) {
        if (typeof fn !== 'function')
            throw new TypeError(`${fn} is not a function`);
        if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);

        const iter = this.entries();
        return Array.from({ length: this.size }, (): T => {
            const [key, value] = iter.next().value;
            return fn(value, key, this);
        });
    }

    public reduce<T>(
        fn: (accumulator: T, value: V, key: K, collection: this) => T,
        initialValue: T
    ) {
        if (typeof fn !== 'function')
            throw new TypeError(`${fn} is not a function`);

        let accumulator = initialValue;
        for (const [key, val] of this) {
            accumulator = fn(accumulator, val, key, this);
        }

        return accumulator;
    }
}
