import { parseFrontMatter } from '../utils/frontMatterParser';
import type { Post } from '../types';

const files = import.meta.glob('../content/posts/*.md', { eager: true, query: '?raw', import: 'default' });

export const posts: Record<string, Post> = {};

for (const path in files) {
  const slug = path.split('/').pop()?.replace('.md', '') || '';
  const raw = files[path] as string;
  const { frontMatter, content } = parseFrontMatter(raw);
  const tags: string[] = Array.isArray(frontMatter.tags)
    ? frontMatter.tags.map((t: any) => String(t))
    : typeof frontMatter.tags === 'string'
      ? frontMatter.tags.split(',').map((t: string) => t.trim())
      : [];
  posts[slug] = {
    slug,
    title: frontMatter.title || 'Untitled Post',
    date: frontMatter.date || new Date().toISOString().split('T')[0],
    author: frontMatter.author || 'Unknown Author',
    excerpt: frontMatter.excerpt || '',
    tags,
    imageUrl: frontMatter.imageUrl,
    markdownContent: content,
  };
}

export const allPosts = Object.values(posts);
