
import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Element } from 'hast'; // For node type

interface MarkdownRendererProps {
  content: string;
}

// Define the expected props structure for the 'code' component
// based on react-markdown's typical signature.
type CodeComponentProps = {
  node: Element;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  // Allows for other HTML attributes to be collected by ...props
  [key: string]: any; 
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const customComponents: Components = {
    h1: ({ node, ...props }) => <h1 className="text-4xl font-bold my-6 border-b pb-2 border-gray-300" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold my-5 border-b pb-2 border-gray-200" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold my-4" {...props} />,
    p: ({ node, ...props }) => <p className="my-4 leading-relaxed" {...props} />,
    a: ({ node, ...props }) => <a className="text-primary-600 hover:text-primary-800 underline" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-8 my-4 space-y-1" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal pl-8 my-4 space-y-1" {...props} />,
    li: ({ node, ...props }) => <li className="my-1" {...props} />,
    code: ({ node, inline, className, children, ...props }: CodeComponentProps) => { // Applied explicit type here
      const match = /language-(\w+)/.exec(className || '');
      if (!inline && match) {
        return (
          <pre className="bg-gray-900 text-white p-4 rounded-md my-4 overflow-x-auto">
            <code className={`language-${match[1]}`} {...props}>
              {String(children).replace(/\n$/, '')}
            </code>
          </pre>
        );
      }
      // For inline code, ensure className is handled gracefully
      return (
        <code className={`bg-gray-200 text-red-600 px-1 py-0.5 rounded text-sm ${className || ''}`} {...props}>
          {children}
        </code>
      );
    },
    blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600" {...props} />,
  };

  return (
    <div className="prose prose-lg max-w-none text-gray-800">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={customComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
