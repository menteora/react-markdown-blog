import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { initGA } from '../utils/analytics';
import { useSiteConfig } from './SiteConfigContext';

interface CookieConsentContextType {
  consentGiven: boolean | null; // null: undecided, true: given, false: declined
  showBanner: boolean;
  giveConsent: () => void;
  declineConsent: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

// Helper function to safely call gtag for consent updates
const safeGtagConsentUpdate = (consentArgs: Record<string, 'granted' | 'denied'>) => {
  if (window.gtag) {
    window.gtag('consent', 'update', consentArgs);
    console.log('gtag consent updated:', consentArgs);
  } else {
    // This case is less likely if gtag.js is loaded, but good to be aware.
    // The default consent state set in index.html will hold until gtag is available.
    console.warn('gtag not available for consent update. Default consent settings apply.');
  }
};

export const CookieConsentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const { config: siteConfig, isLoading: isSiteConfigLoading } = useSiteConfig();

  const initializeConsent = useCallback(() => {
    const storedConsent = localStorage.getItem('cookieConsent');
    const gaId = siteConfig.gaMeasurementId;

    if (storedConsent === 'true') {
      safeGtagConsentUpdate({ 'analytics_storage': 'granted' });
      setConsentGiven(true);
      setShowBanner(false);
      if (gaId && !isSiteConfigLoading && window.gtag) {
        initGA(gaId); // initGA calls gtag('config', ...) which depends on consent
      }
    } else if (storedConsent === 'false') {
      safeGtagConsentUpdate({ 'analytics_storage': 'denied' });
      setConsentGiven(false);
      setShowBanner(false);
    } else {
      // Undecided: Default consent 'denied' for analytics_storage (set in index.html) applies.
      setConsentGiven(null);
      setShowBanner(true);
    }
  }, [siteConfig.gaMeasurementId, isSiteConfigLoading]);

  useEffect(() => {
    // Initialize only when site config is loaded to ensure gaId is available
    if (!isSiteConfigLoading) {
        initializeConsent();
    }
  }, [isSiteConfigLoading, initializeConsent]);

  const giveConsent = () => {
    const gaId = siteConfig.gaMeasurementId;
    safeGtagConsentUpdate({ 'analytics_storage': 'granted' });
    setConsentGiven(true);
    setShowBanner(false);
    localStorage.setItem('cookieConsent', 'true');
    if (gaId && !isSiteConfigLoading && window.gtag) {
      initGA(gaId);
    }
  };

  const declineConsent = () => {
    safeGtagConsentUpdate({ 'analytics_storage': 'denied' });
    setConsentGiven(false);
    setShowBanner(false);
    localStorage.setItem('cookieConsent', 'false');
  };

  return (
    <CookieConsentContext.Provider value={{ consentGiven, showBanner, giveConsent, declineConsent }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};