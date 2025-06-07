
import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden transition-shadow hover:shadow-xl duration-300 flex flex-col">
      {post.imageUrl && (
        <Link to={`/post/${post.slug}`} aria-hidden="true" tabIndex={-1}>
          <img 
            src={post.imageUrl} 
            alt={`Featured image for ${post.title}`} 
            className="w-full h-48 object-cover" 
            loading="lazy"
          />
        </Link>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-2xl font-bold text-primary-700 mb-2">
          <Link to={`/post/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>
        <div className="text-sm text-gray-500 mb-3">
          <span>By {post.author}</span> | <span>{new Date(post.date).toLocaleDateString()}</span>
        </div>
        <p className="text-gray-700 mb-4 leading-relaxed flex-grow">{post.excerpt}</p>
        <div className="mb-4">
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
        <div className="mt-auto">
          <Link
            to={`/post/${post.slug}`}
            className="inline-block bg-primary-600 text-white font-semibold px-4 py-2 rounded hover:bg-primary-700 transition-colors duration-300"
          >
            Read More &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
