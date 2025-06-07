import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import { useSiteConfig } from '../contexts/SiteConfigContext';
import { sendPageView } from '../utils/analytics';

const AnalyticsRouteChangeTracker: React.FC = () => {
  const location = useLocation();
  const { consentGiven } = useCookieConsent();
  const { config: siteConfig, isLoading: isSiteConfigLoading } = useSiteConfig();

  useEffect(() => {
    // Send page view if consent is given, GA is configured, and site config is loaded
    if (consentGiven && !isSiteConfigLoading && siteConfig.gaMeasurementId && window.gtag) {
      // location.pathname for HashRouter gives the path after #, e.g., "/post/my-slug"
      sendPageView(location.pathname, siteConfig.gaMeasurementId);
    }
  }, [location.pathname, consentGiven, siteConfig.gaMeasurementId, isSiteConfigLoading]);

  return null; // This component does not render anything
};

export default AnalyticsRouteChangeTracker;
