import React, { useEffect, useState } from 'react';
import { getAllPostMetadata } from '../utils/postUtils';
import PostCard from '../components/PostCard';
import { Post } from '../types';
import { useSiteConfig } from '../contexts/SiteConfigContext';

const POSTS_PER_PAGE = 10;

const HomePage: React.FC = () => {
  const { config, isLoading: isConfigLoading, error: configError } = useSiteConfig();
  const [allPosts, setAllPosts] = useState<Omit<Post, 'markdownContent'>[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadPosts = () => {
      setIsLoadingPosts(true);
      setPostsError(null);
      try {
        const posts = getAllPostMetadata();
        const sortedPosts = posts.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setAllPosts(sortedPosts);
      } catch (err: any) {
        console.error("Failed to load posts:", err);
        setPostsError(`Could not load posts. ${err.message || "Please try again later."}`);
      } finally {
        setIsLoadingPosts(false);
      }
    };
    loadPosts();
  }, []);

  const heroImageUrl = isConfigLoading || configError ? null : config.homepageHeroImageUrl;

  // Pagination logic
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (isLoadingPosts) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
        <p className="ml-4 text-lg text-gray-700">Loading posts...</p>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Posts</h1>
        <p className="text-lg text-gray-700">{postsError}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {heroImageUrl && (
        <section className="mb-12 rounded-lg overflow-hidden shadow-xl">
          <img 
            src={heroImageUrl} 
            alt="Blog hero banner" 
            className="w-full h-auto max-h-[300px] md:max-h-[400px] object-cover" 
          />
        </section>
      )}

      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold text-primary-800">Welcome to the Blog</h1>
        <p className="text-xl text-gray-600 mt-2">Discover insights and stories on web development, technology, and more.</p>
      </header>
      
      {currentPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map(post => (
              <PostCard key={post.slug} post={post as Post} /> 
            ))}
          </div>
          {totalPages > 1 && (
            <nav aria-label="Posts pagination" className="mt-12 flex justify-center items-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                &larr; Previous
              </button>
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 rounded transition-colors ${
                    currentPage === number
                      ? 'bg-primary-800 text-white font-bold ring-2 ring-primary-500'
                      : 'bg-primary-200 text-primary-700 hover:bg-primary-300'
                  }`}
                  aria-current={currentPage === number ? "page" : undefined}
                  aria-label={`Go to page ${number}`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                Next &rarr;
              </button>
            </nav>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700">No posts yet!</h2>
          <p className="text-gray-500 mt-2">Check back soon for new content.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;