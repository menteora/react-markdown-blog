import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import yaml from 'js-yaml';

interface SiteConfig {
  blogTitle: string;
  homepageHeroImageUrl?: string;
  gaMeasurementId?: string; 
}

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
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/config.yml');
        if (!response.ok) {
          throw new Error(`Failed to fetch config.yml: ${response.statusText} (status: ${response.status})`);
        }
        const yamlText = await response.text();
        const parsedYaml = yaml.load(yamlText);
        
        const loadedConfigData = (typeof parsedYaml === 'object' && parsedYaml !== null ? parsedYaml : {}) as Partial<SiteConfig>;
        
        setConfig({
            blogTitle: loadedConfigData.blogTitle || defaultConfig.blogTitle,
            homepageHeroImageUrl: loadedConfigData.homepageHeroImageUrl || defaultConfig.homepageHeroImageUrl,
            gaMeasurementId: loadedConfigData.gaMeasurementId || defaultConfig.gaMeasurementId,
        });
        setError(null);
      } catch (err: any) {
        console.error("Error loading or parsing config.yml:", err);
        setError(err.message || "Could not load site configuration.");
        setConfig(defaultConfig); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return (
    <SiteConfigContext.Provider value={{ config, isLoading, error }}>
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