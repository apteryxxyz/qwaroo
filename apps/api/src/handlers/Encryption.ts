import { Buffer } from 'node:buffer';
import {
    createCipheriv,
    createDecipheriv,
    randomBytes,
    scryptSync,
    timingSafeEqual,
} from 'node:crypto';
import { readFileSync } from 'node:fs';

const CIPHER_KEY = readFileSync('.key', 'utf8');

export class Encryption extends null {
    /** Hashes a string, used for passwords. */
    public static hashString(data: string) {
        const salt = randomBytes(16).toString('hex');
        const hash = scryptSync(data, salt, 64).toString('hex');
        return `${salt}-${hash}`;
    }

    /** Verifies that a string matches a hash, used for passwords. */
    public static verifyString(secret: string, input: string) {
        const [salt, hash] = secret.split('-');
        const hashBuffer = Buffer.from(hash, 'hex');
        const inputBuffer = scryptSync(input, salt, 64);
        return timingSafeEqual(hashBuffer, inputBuffer);
    }

    /** Generally encrypt a string. */
    public static encryptString(data: string) {
        const key = Buffer.from(CIPHER_KEY, 'hex');
        const iv = randomBytes(16);
        const cipher = createCipheriv('aes256', key, iv);
        const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

        return `${iv.toString('hex')}-${encrypted.toString('hex')}`;
    }

    /** Generally decrypt a string. */
    public static decryptString(data: string) {
        const key = Buffer.from(CIPHER_KEY, 'hex');
        const [iv, encrypted] = data.split('-');
        const decipher = createDecipheriv(
            'aes256',
            key,
            Buffer.from(iv, 'hex')
        );

        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(encrypted, 'hex')),
            decipher.final(),
        ]);
        return decrypted.toString();
    }
}
