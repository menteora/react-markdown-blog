import React, { createContext, useContext, ReactNode } from 'react';
import { siteConfig, SiteConfig } from '../data/siteConfig';

// SiteConfig type is imported from data/siteConfig

interface SiteConfigContextType {
  config: SiteConfig;
  isLoading: boolean;
  error: string | null;
}

const defaultConfig: SiteConfig = {
  blogTitle: "My Awesome Blog", 
  homepageHeroImageUrl: undefined,
  gaMeasurementId: undefined,
};

const SiteConfigContext = createContext<SiteConfigContextType>({
  config: defaultConfig,
  isLoading: true,
  error: null,
});

export const SiteConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const contextValue: SiteConfigContextType = {
    config: siteConfig,
    isLoading: false,
    error: null,
  };

  return (
    <SiteConfigContext.Provider value={contextValue}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (context === undefined) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
};