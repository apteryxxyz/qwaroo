import path from 'path';
import { Bucket } from '@qwaroo/bucket';

const bucketPath = path.join(process.cwd(), 'bucket');
const bucket = new Bucket({ directory: bucketPath });

export { bucket };
