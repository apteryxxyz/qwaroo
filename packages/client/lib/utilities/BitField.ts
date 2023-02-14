interface Enum<T> {
    [id: string]: T | string;
    [nu: number]: string;
}

export function BitField<F extends Enum<number>>(flags: F) {
    return class BitField {
        public static Flags = flags;

        public bitfield: number;

        public constructor(bit: BitField.Resolvable<F>) {
            this.bitfield = BitField.resolve(bit);
        }

        public add(...bits: BitField.Resolvable<F>[]) {
            let total = 0;
            for (const bit of bits) total |= BitField.resolve(bit);

            if (Object.isFrozen(this))
                return new (this.constructor(this.bitfield | total))();
            this.bitfield |= total;
            return this;
        }

        public remove(...bits: BitField.Resolvable<F>[]) {
            let total = 0;
            for (const bit of bits) total |= BitField.resolve(bit);

            if (Object.isFrozen(this))
                return new (this.constructor(this.bitfield & ~total))();
            this.bitfield &= ~total;
            return this;
        }

        public has(bit: BitField.Resolvable<F>) {
            return (
                (this.bitfield & BitField.resolve(bit)) ===
                BitField.resolve(bit)
            );
        }

        public missing(...bits: BitField.Resolvable<F>[]) {
            return bits.filter(it => !this.has(it));
        }

        public any(bit: BitField.Resolvable<F>) {
            return (this.bitfield & BitField.resolve(bit)) !== 0;
        }

        public equals(bit: BitField.Resolvable<F>) {
            return this.bitfield === BitField.resolve(bit);
        }

        public freeze() {
            return Object.freeze(this);
        }

        public toArray() {
            return Object.keys(flags).filter(it => this.has(it));
        }

        public toJSON() {
            return this.bitfield;
        }

        public valueOf() {
            return this.bitfield;
        }

        public *[Symbol.iterator]() {
            yield* this.toArray();
        }

        public static resolve(bit: BitField.Resolvable<F>): number {
            if (typeof bit === 'number' && bit > 0) return bit;

            if (bit instanceof BitField) return bit.bitfield;

            if (Array.isArray(bit))
                return bit
                    .map(BitField.resolve)
                    .reduce((prev, it) => prev | it, 0);

            if (typeof bit === 'string' && bit in flags)
                return Number(flags[bit]);

            return 0;
        }

        public get [Symbol.toStringTag]() {
            return 'BitField';
        }
    };
}

export namespace BitField {
    export type Resolvable<F extends Enum<number>> =
        | number
        | keyof F
        | ReturnType<typeof BitField<F>>
        | Resolvable<F>[];
}
