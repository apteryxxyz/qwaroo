import {
    existsSync,
    lstatSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    rmSync,
    writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import * as process from 'node:process';

export class FileSystem extends null {
    public static async readDirectory(path: string) {
        path = join(process.cwd(), 'static', path);
        if (!existsSync(path)) return 404;
        if (!lstatSync(path).isDirectory()) return 400;
        return readdirSync(path);
    }

    public static async readFile(path: string) {
        path = join(process.cwd(), 'static', path);
        if (!existsSync(path)) return 404;
        if (!lstatSync(path).isFile()) return 400;
        return readFileSync(path);
    }

    public static async writeFile(path: string, data: string) {
        path = join(process.cwd(), 'static', path);
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(path, data, { encoding: 'utf8' });
        return data;
    }

    public static async deleteFile(path: string) {
        path = join(process.cwd(), 'static', path);
        if (!existsSync(path)) return 404;
        if (!lstatSync(path).isFile()) return 400;
        rmSync(path, { recursive: true, force: true });
        return 200;
    }
}
