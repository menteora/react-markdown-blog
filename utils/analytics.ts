// Declare gtag on the window object
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const initGA = (measurementId: string): void => {
  if (window.gtag && measurementId) {
    // For GA4, 'anonymize_ip' is true by default and not configurable.
    window.gtag('config', measurementId);
    console.log(`Google Analytics (GA4 mode) initialized with Measurement ID: ${measurementId}`);
  } else {
    if (!measurementId) console.warn('Google Analytics: Measurement ID is missing.');
    if (!window.gtag) console.warn('Google Analytics: gtag.js is not loaded.');
  }
};

export const sendPageView = (path: string, measurementId: string): void => {
  if (window.gtag && measurementId) {
    // For HashRouter, the path from useLocation starts with '/', 
    // but page_path for GA typically should be the part after #
    // However, gtag standard is to send the full path including the hash.
    // So, we can use `window.location.hash.substring(1)` or react-router's `location.pathname`.
    // Let's stick to path provided by react-router for consistency.
    window.gtag('event', 'page_view', {
      page_path: path, // path from react-router, e.g., "/post/my-slug"
      page_location: window.location.href, // Full URL including hash
      send_to: measurementId,
    });
    // console.log(`Page view sent for: ${path} (GA ID: ${measurementId})`);
  } else {
     if (!measurementId) console.warn('Google Analytics: Measurement ID is missing for page view.');
     // gtag not loaded warning is handled by initGA
  }
};
