import { parseFrontMatter } from '../utils/frontMatterParser';
import type { Page } from '../types';

const files = import.meta.glob('../content/pages/*.md', { eager: true, query: '?raw', import: 'default' });

export const pages: Record<string, Page> = {};

for (const path in files) {
  const slug = path.split('/').pop()?.replace('.md', '') || '';
  const raw = files[path] as string;
  const { frontMatter, content } = parseFrontMatter(raw);
  pages[slug] = {
    slug,
    title: frontMatter.title || 'Untitled Page',
    markdownContent: content,
  };
}

export const allPages = Object.values(pages);
