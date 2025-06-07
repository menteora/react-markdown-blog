import React, { useState, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Assume process.env.API_KEY is available in the environment as per guidelines
const API_KEY = process.env.API_KEY;

interface GeminiQueryBoxProps {
  postContent: string;
}

const GeminiQueryBox: React.FC<GeminiQueryBoxProps> = ({ postContent }) => {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuerySubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }
    if (!API_KEY) {
      setError('API key is not configured. Please contact the site administrator.');
      console.error('Gemini API Key (process.env.API_KEY) is missing.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnswer('');

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      
      const modelInstruction = "You are a helpful assistant. Your sole task is to answer questions based *only* on the provided blog post text. Do not use any external knowledge or information outside of this text. If the answer cannot be found in the provided blog post, clearly state that the information is not available in the post.";
      
      const fullPrompt = `Blog Post Content:\n---\n${postContent}\n---\n\nBased *only* on the blog post content provided above, please answer the following question:\n\nQuestion: "${question}"`;

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: fullPrompt,
        config: {
          systemInstruction: modelInstruction,
        }
      });

      setAnswer(response.text);
    } catch (err: any) {
      console.error('Error querying Gemini API:', err);
      setError(`Failed to get an answer from Gemini. ${err.message || 'Please try again.'}`);
      setAnswer('');
    } finally {
      setIsLoading(false);
    }
  }, [question, postContent]);

  return (
    <section aria-labelledby="gemini-query-title">
      <h3 id="gemini-query-title" className="text-2xl font-semibold text-gray-800 mb-4">
        Ask Gemini About This Post
      </h3>
      {!API_KEY && (
         <div 
            className="mb-4 p-4 text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-md" 
            role="alert"
          >
           The Ask Gemini feature is currently unavailable due to a missing API key configuration.
         </div>
      )}
      <form onSubmit={handleQuerySubmit} className="space-y-4">
        <div>
          <label htmlFor="gemini-question" className="block text-sm font-medium text-gray-700 mb-1">
            Your Question:
          </label>
          <textarea
            id="gemini-question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What are the main points of this post?"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-100"
            rows={3}
            disabled={isLoading || !API_KEY}
            aria-describedby={error ? "gemini-error-message" : undefined}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !question.trim() || !API_KEY}
          className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          {isLoading ? 'Thinking...' : 'Ask Gemini'}
        </button>
      </form>

      {error && (
        <p id="gemini-error-message" className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {answer && !error && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Gemini's Answer:</h4>
          <div 
            className="p-4 bg-gray-50 border border-gray-200 rounded-md prose prose-sm max-w-none whitespace-pre-wrap"
            aria-live="polite"
          >
            {answer}
          </div>
        </div>
      )}
    </section>
  );
};

export default GeminiQueryBox;