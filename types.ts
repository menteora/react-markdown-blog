
export interface Post {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  markdownContent?: string; // Made optional
  tags: string[];
  imageUrl?: string; // Optional: URL for the post's featured image
}

export interface Page {
  slug: string;
  title: string;
  markdownContent?: string;
  // Add other page-specific front matter fields if needed in the future
}
