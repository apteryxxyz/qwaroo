import fs from 'node:fs/promises';
import path from 'node:path';
import type { User } from '@qwaroo/database';
import { File } from '@qwaroo/database';
import type { MimeType } from 'file-type';
import { fromBuffer } from 'file-type';
import objectHash from 'object-hash';

async function findContentType(buffer: Buffer) {
    const type = await fromBuffer(buffer);
    if (type) return type.mime;
    return 'application/octet-stream';
}

export class Bucket {
    public fileSystemPath: string;

    public constructor(options: Bucket.Options) {
        this.fileSystemPath = options.fileSystemPath;
    }

    public async createFile(
        uploader: User.Document,
        data: Buffer,
        metadata: Bucket.File.Metadata = {}
    ) {
        const length = data.length;
        if (length > 5 * 1_024 * 1_024)
            throw new Error('File size exceeds maximum allowed size of 5MB');

        const hash = objectHash(data);
        const type = await findContentType(data);

        const location = path.join(this.fileSystemPath, hash);
        await fs
            .access(location)
            .catch(async () => fs.writeFile(location, data));

        return File.Model.create({ uploader, hash, type, length, metadata });
    }

    public async readFile(ref: File.Document | string): Promise<Buffer | null> {
        const file =
            typeof ref === 'string' ? await File.Model.findById(ref) : ref;
        if (!file) return null;

        const location = path.join(this.fileSystemPath, file.hash);
        return fs
            .access(location)
            .then(async () => fs.readFile(location))
            .catch(() => null);
    }

    public async deleteFile(ref: File.Document | string) {
        const file =
            typeof ref === 'string' ? await File.Model.findById(ref) : ref;
        if (!file) return null;

        await file.deleteOne();

        const location = path.join(this.fileSystemPath, file.hash);
        await fs
            .access(location)
            .then(async () => fs.unlink(location))
            .catch(() => null);

        return null;
    }
}

export namespace Bucket {
    export interface Options {
        fileSystemPath: string;
    }

    export namespace File {
        export type Type = MimeType | 'application/octet-stream';

        export interface Metadata {
            [hash: string]: string;
        }
    }
}
