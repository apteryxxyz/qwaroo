import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from 'contentlayer/source-files';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.split('/').at(-1),
  },
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
    authors: { type: 'list', required: true, of: Author },
  },
  computedFields,
}));

export const Author = defineNestedType(() => ({
  name: 'Author',
  fields: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    githubUsername: { type: 'string' },
    twitterUsername: { type: 'string' },
  },
}));

export const Policy = defineDocumentType(() => ({
  name: 'Policy',
  filePathPattern: 'policies/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    updatedAt: { type: 'date', required: true },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: './src/content',
  documentTypes: [Policy, Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
});
