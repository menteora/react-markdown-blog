import { Post } from '../types';
import { parseFrontMatter } from './frontMatterParser';

// Read all markdown files at build time
const postFiles = import.meta.glob('../content/posts/*.md', { query: '?raw', import: 'default', eager: true });

const DEFAULT_POST_VALUES: Omit<Post, 'slug' | 'markdownContent'> = {
  title: 'Untitled Post',
  date: new Date().toISOString().split('T')[0],
  author: 'Unknown Author',
  excerpt: 'No excerpt available for this post.',
  tags: [],
  imageUrl: undefined,
};

interface ParsedPost extends Post {
  markdownContent: string;
}

const parsedPosts: ParsedPost[] = Object.entries(postFiles).map(([filePath, raw]) => {
  const slug = filePath.split('/').pop()?.replace('.md', '') || '';
  const { frontMatter, content } = parseFrontMatter(raw as string);
  const tags: string[] = Array.isArray(frontMatter.tags)
    ? frontMatter.tags.map((t: any) => String(t).trim()).filter(Boolean)
    : typeof frontMatter.tags === 'string'
      ? frontMatter.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
      : DEFAULT_POST_VALUES.tags;

  return {
    slug,
    title: (frontMatter.title as string) || DEFAULT_POST_VALUES.title,
    date: (frontMatter.date as string) || DEFAULT_POST_VALUES.date,
    author: (frontMatter.author as string) || DEFAULT_POST_VALUES.author,
    excerpt: (frontMatter.excerpt as string) || DEFAULT_POST_VALUES.excerpt,
    tags: tags.length > 0 ? tags : DEFAULT_POST_VALUES.tags,
    imageUrl: (frontMatter.imageUrl as string) || DEFAULT_POST_VALUES.imageUrl,
    markdownContent: content,
  };
});

export function getAllPostMetadata(): Omit<Post, 'markdownContent'>[] {
  return parsedPosts.map(({ markdownContent, ...meta }) => meta);
}

export function getPostBySlug(slug: string): Post | undefined {
  return parsedPosts.find(p => p.slug === slug);
}
