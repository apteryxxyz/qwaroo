import fs from 'node:fs/promises';
import path from 'node:path';
import type { User } from '@qwaroo/database';
import { File } from '@qwaroo/database';
import type { MimeType } from 'file-type';
import { fromBuffer } from 'file-type';
import objectHash from 'object-hash';

/** Determines the content type of a buffer. */
async function findContentType(buffer: Buffer) {
  // Content type is never actually used, but it's nice to have
  const type = await fromBuffer(buffer);
  if (type) return type.mime;
  return 'application/octet-stream';
}

/** A bucket is a storage location for files. */
export class Bucket {
  /** The directory for the bucket's files. */
  public directory: string;

  public constructor(options: Bucket.Options) {
    this.directory = options.directory;
  }

  /** Create a new file in the bucket. */
  public async createFile(
    uploader: User.Document,
    data: Buffer,
    metadata: Bucket.File.Metadata = {},
  ) {
    const length = data.length;
    // Currently stored locally so we limit the size to 5MB
    if (length > 5 * 1_024 * 1_024)
      throw new Error('File size exceeds maximum allowed size of 5MB');

    const hash = objectHash(data);
    const type = await findContentType(data);

    const location = path.join(this.directory, hash);
    // Only write the file if it doesn't already exist
    await fs.access(location).catch(async () => fs.writeFile(location, data));

    return File.Model.create({ uploader, hash, type, length, metadata });
  }

  /** Read a file from the bucket. */
  public async readFile(ref: File.Document | string): Promise<Buffer | null> {
    const file = typeof ref === 'string' ? await File.Model.findById(ref) : ref;
    if (!file) return null;

    const location = path.join(this.directory, file.hash);
    return fs
      .access(location)
      .then(async () => fs.readFile(location))
      .catch(() => null);
  }

  /** Delete a file from the bucket. */
  public async deleteFile(ref: File.Document | string) {
    const file = typeof ref === 'string' ? await File.Model.findById(ref) : ref;
    if (!file) return null;

    await file.deleteOne();

    const location = path.join(this.directory, file.hash);
    await fs
      .access(location)
      .then(async () => fs.unlink(location))
      .catch(() => null);

    return null;
  }
}

export namespace Bucket {
  export interface Options {
    directory: string;
  }

  export namespace File {
    export type Type = MimeType | 'application/octet-stream';

    export type Metadata = Record<string, string>;
  }
}
