import path from 'node:path';
import { Bucket } from '@qwaroo/bucket';

const bucketPath = path.join(process.cwd(), 'bucket');
export const bucket = new Bucket({ directory: bucketPath });
