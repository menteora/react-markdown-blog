import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSiteConfig } from '../contexts/SiteConfigContext';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { config, isLoading: isConfigLoading, error: configError } = useSiteConfig();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-primary-200 border-b-2 border-primary-200 pb-1"
      : "hover:text-primary-200 transition-colors pb-1 border-b-2 border-transparent hover:border-primary-300";

  const getMobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "block py-2 px-3 text-primary-200 bg-primary-600 rounded"
      : "block py-2 px-3 hover:bg-primary-600 hover:text-primary-100 rounded transition-colors";

  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/tags", text: "Tags" },
    { to: "/page/about", text: "About" },
    { to: "/page/privacy-policy", text: "Informativa Privacy" },
  ];

  const displayTitle = isConfigLoading ? "Loading..." : (configError ? "Blog" : config.blogTitle);

  return (
    <nav className="bg-primary-700 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-primary-200 transition-colors" aria-label="Go to homepage">
          {displayTitle}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to} className={getNavLinkClass}>
              {link.text}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            className="p-2 rounded-md text-primary-200 hover:text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            {isMobileMenuOpen ? (
              // X icon
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-primary-700 border-t border-primary-600">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={getMobileNavLinkClass}
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
              >
                {link.text}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;