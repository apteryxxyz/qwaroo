import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
  slug: { type: 'string', resolve: (doc) => doc._raw.flattenedPath },
};

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'posts/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    bannerText: { type: 'string' },
    publishedAt: { type: 'date', required: true },
    coverImage: { type: 'string' },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: './src/content',
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
});
