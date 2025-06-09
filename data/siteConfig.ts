import yaml from 'js-yaml';
import rawConfig from '../public/config.yml?raw';

export interface SiteConfig {
  blogTitle: string;
  homepageHeroImageUrl?: string;
  gaMeasurementId?: string;
}

const parsed = ((): SiteConfig => {
  try {
    const data = yaml.load(rawConfig) as Partial<SiteConfig> | undefined;
    return {
      blogTitle: data?.blogTitle || 'My Awesome Blog',
      homepageHeroImageUrl: data?.homepageHeroImageUrl,
      gaMeasurementId: data?.gaMeasurementId,
    };
  } catch {
    return { blogTitle: 'My Awesome Blog' };
  }
})();

export const siteConfig: SiteConfig = parsed;
