import { Post } from '../types';
import { parseFrontMatter } from './frontMatterParser';

// Default values for a post if front matter is incomplete
const DEFAULT_POST_VALUES: Omit<Post, 'slug' | 'markdownContent'> = {
  title: 'Untitled Post',
  date: new Date().toISOString().split('T')[0], // Today's date
  author: 'Unknown Author',
  excerpt: 'No excerpt available for this post.',
  tags: [],
  imageUrl: undefined,
};

export async function fetchPostMetadataBySlug(slug: string): Promise<Omit<Post, 'markdownContent'>> {
  try {
    const response = await fetch(`/content/posts/${slug}.md`);
    if (!response.ok) {
      throw new Error(`File not found or unreadable (status: ${response.status})`);
    }
    const rawContent = await response.text();
    const { frontMatter } = parseFrontMatter(rawContent);

    // Ensure tags are always an array of strings, using what parseFrontMatter provides
    const tags: string[] = Array.isArray(frontMatter.tags) 
      ? frontMatter.tags.map(String).filter(tag => tag.trim()) 
      : (typeof frontMatter.tags === 'string' && frontMatter.tags 
          ? frontMatter.tags.split(',').map(tag => tag.trim()).filter(tag => tag) 
          : DEFAULT_POST_VALUES.tags);

    return {
      slug,
      title: (frontMatter.title as string) || DEFAULT_POST_VALUES.title,
      date: (frontMatter.date as string) || DEFAULT_POST_VALUES.date,
      author: (frontMatter.author as string) || DEFAULT_POST_VALUES.author,
      excerpt: (frontMatter.excerpt as string) || DEFAULT_POST_VALUES.excerpt,
      tags: tags.length > 0 ? tags : DEFAULT_POST_VALUES.tags,
      imageUrl: (frontMatter.imageUrl as string) || DEFAULT_POST_VALUES.imageUrl,
    };
  } catch (error: any) {
    console.error(`Error fetching metadata for slug "${slug}":`, error.message);
    return {
      slug,
      ...DEFAULT_POST_VALUES,
      title: `Error Loading: ${slug}`,
      excerpt: `Failed to load metadata for this post. ${error.message || 'Unknown error.'}`,
      tags: [], // Ensure tags is an empty array on error
    };
  }
}
