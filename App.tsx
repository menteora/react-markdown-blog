import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import TagsPage from './pages/TagsPage';
import PostsByTagPage from './pages/PostsByTagPage';
import GenericPage from './pages/GenericPage';
import { SiteConfigProvider } from './contexts/SiteConfigContext';
import { CookieConsentProvider } from './contexts/CookieConsentContext';
import CookieConsentBanner from './components/CookieConsentBanner';
import AnalyticsRouteChangeTracker from './components/AnalyticsRouteChangeTracker';

const App: React.FC = () => {
  return (
    <SiteConfigProvider>
      <CookieConsentProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow bg-gray-100 py-8">
              <AnalyticsRouteChangeTracker />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/post/:slug" element={<PostPage />} />
                <Route path="/tags" element={<TagsPage />} />
                <Route path="/tags/:tagName" element={<PostsByTagPage />} />
                {/* 
                  Consolidated route for generic pages.
                  This allows GenericPage to use useParams() to get the slug (e.g., 'about', 'privacy-policy')
                  and fetch the corresponding markdown file from /content/pages/:slug.md
                */}
                <Route path="/page/:slug" element={<GenericPage />} />
              </Routes>
            </main>
            <CookieConsentBanner />
            <footer className="bg-primary-800 text-primary-100 text-center p-6 shadow-inner">
              <p>&copy; {new Date().getFullYear()} React Markdown Blog. All rights reserved.</p>
              <p className="text-sm mt-1">
                Powered by React, Tailwind CSS, and your Markdown! |{' '}
                <Link to="/page/privacy-policy" className="underline hover:text-primary-300">
                  Informativa Privacy e Cookie Policy
                </Link>
              </p>
            </footer>
          </div>
        </BrowserRouter>
      </CookieConsentProvider>
    </SiteConfigProvider>
  );
};

export default App;