
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Page } from '../types';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { parseFrontMatter } from '../utils/frontMatterParser';

const GenericPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Page slug is missing.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setPage(undefined);

    fetch(`/content/pages/${slug}.md`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch page content: ${response.statusText} (status: ${response.status})`);
        }
        return response.text();
      })
      .then(rawContent => {
        const { frontMatter, content: markdownBody } = parseFrontMatter(rawContent); // frontMatter is Record<string, any>
        
        const pageData: Page = {
          slug: slug,
          title: (frontMatter.title as string) || 'Untitled Page', // Default title if not in front matter
          markdownContent: markdownBody,
        };
        setPage(pageData);
      })
      .catch(err => {
        console.error('Error processing page content:', err);
        setError(`Could not load page content. ${err.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });

  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
        <p className="ml-4 text-lg text-gray-700">Loading page...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-lg text-gray-700 mb-6">{error || 'Page data could not be loaded.'}</p>
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-800">{page.title}</h1>
        </header>

        {page.markdownContent ? (
          <MarkdownRenderer content={page.markdownContent} />
        ) : (
          <p className="text-gray-500">Content is not available for this page.</p>
        )}

        <footer className="mt-12 pt-6 border-t border-gray-200">
          <Link
            to="/"
            className="text-primary-600 hover:text-primary-800 hover:underline font-semibold transition-colors"
          >
            &larr; Back to Home
          </Link>
        </footer>
      </article>
    </div>
  );
};

export default GenericPage;