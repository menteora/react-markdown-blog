import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post } from '../types';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { posts as staticPosts } from '../data/posts';

// SVG Icons for Social Sharing (remain unchanged)
const TwitterIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
  </svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.59-11.018-3.714v-2.155z" />
  </svg>
);

const EmailIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const DEFAULT_POST_PAGE_VALUES: Omit<Post, 'slug'> = {
  title: 'Untitled Post',
  date: new Date().toISOString().split('T')[0],
  author: 'Unknown Author',
  excerpt: 'No excerpt available for this post.',
  tags: [],
  imageUrl: undefined,
  markdownContent: '# Content Not Found\n\nSorry, the content for this post could not be loaded.',
};


const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Post slug is missing.');
      setIsLoading(false);
      setPost({ ...DEFAULT_POST_PAGE_VALUES, slug: 'unknown-slug' });
      return;
    }

    setIsLoading(true);
    setError(null);
    setPost(undefined);

    const found = staticPosts[slug];
    if (found) {
      setPost(found);
      setIsLoading(false);
    } else {
      setError('Post not found.');
      setPost({ ...DEFAULT_POST_PAGE_VALUES, slug: slug, title: `Error: ${slug}` });
      setIsLoading(false);
    }
  }, [slug]);

  const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin' | 'email') => {
    if (!post) return;

    const postUrl = window.location.href; 
    const encodedPostUrl = encodeURIComponent(postUrl);
    const postTitle = encodeURIComponent(post.title);
    const postExcerpt = encodeURIComponent(post.excerpt);

    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedPostUrl}&text=${postTitle}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedPostUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedPostUrl}&title=${postTitle}&summary=${postExcerpt}`;
        break;
      case 'email':
        window.location.href = `mailto:?subject=${postTitle}&body=${encodeURIComponent('Check out this post: ' + postUrl)}`;
        return; 
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };


  if (isLoading) { 
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
        <p className="ml-4 text-lg text-gray-700">Loading post...</p>
      </div>
    );
  }
  
  // If error state is set, or post is somehow still undefined after loading
  if (error && (!post || post.title.startsWith('Error:'))) { 
     return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-lg text-gray-700 mb-6">{error || 'Post data could not be loaded.'}</p>
        <Link 
          to="/" 
          className="bg-primary-600 text-white font-semibold px-6 py-3 rounded hover:bg-primary-700 transition-colors duration-300"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // If no error, but post is somehow still undefined (should be caught by error state or default post)
  if (!post) {
      return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Post Not Found</h1>
        <p className="text-lg text-gray-700 mb-6">The requested post could not be found.</p>
        <Link 
          to="/" 
          className="bg-primary-600 text-white font-semibold px-6 py-3 rounded hover:bg-primary-700 transition-colors duration-300"
        >
          Back to Home
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="bg-white rounded-lg shadow-xl p-6 md:p-10">
        <header className="mb-8 border-b pb-6 border-gray-200">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-800 mb-3">{post.title}</h1>
          <div className="text-md text-gray-500">
            <span>By {post.author}</span> | <span>Published on {new Date(post.date).toLocaleDateString()}</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4">
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/tags/${encodeURIComponent(tag)}`}
                  className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded-full hover:bg-primary-200 hover:text-primary-800 transition-colors duration-200"
                  aria-label={`View posts tagged with ${tag}`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {post.imageUrl && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <img 
              src={post.imageUrl} 
              alt={`Featured image for ${post.title}`} 
              className="w-full h-auto max-h-[500px] object-cover" 
            />
          </div>
        )}
        
        {post.markdownContent ? (
          <MarkdownRenderer content={post.markdownContent} />
        ) : (
           <p className="text-gray-500">Content is not available for this post.</p>
        )}

        {/* Gemini Query Box Section */}

        {/* Social Share Section */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Share this post</h3>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => handleShare('twitter')}
              aria-label="Share on Twitter"
              title="Share on Twitter"
              className="text-gray-500 hover:text-[#1DA1F2] p-2.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DA1F2] transition-colors duration-200"
            >
              <TwitterIcon />
            </button>
            <button
              onClick={() => handleShare('facebook')}
              aria-label="Share on Facebook"
              title="Share on Facebook"
              className="text-gray-500 hover:text-[#1877F2] p-2.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877F2] transition-colors duration-200"
            >
              <FacebookIcon />
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              aria-label="Share on LinkedIn"
              title="Share on LinkedIn"
              className="text-gray-500 hover:text-[#0A66C2] p-2.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A66C2] transition-colors duration-200"
            >
              <LinkedInIcon />
            </button>
            <button
              onClick={() => handleShare('email')}
              aria-label="Share via Email"
              title="Share via Email"
              className="text-gray-500 hover:text-primary-600 p-2.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <EmailIcon />
            </button>
          </div>
        </div>

        <footer className="mt-12 pt-6 border-t border-gray-200">
          <Link 
            to="/" 
            className="text-primary-600 hover:text-primary-800 hover:underline font-semibold transition-colors"
          >
            &larr; Back to all posts
          </Link>
        </footer>
      </article>
    </div>
  );
};

export default PostPage;