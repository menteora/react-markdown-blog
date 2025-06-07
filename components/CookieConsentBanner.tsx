import React from 'react';
import { useCookieConsent } from '../contexts/CookieConsentContext';
import { Link } from 'react-router-dom';

const CookieConsentBanner: React.FC = () => {
  const { showBanner, giveConsent, declineConsent } = useCookieConsent();

  if (!showBanner) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-primary-800 text-white p-4 shadow-lg z-[100]"
      role="dialog"
      aria-live="polite"
      aria-label="Consenso cookie"
    >
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm mb-3 sm:mb-0 sm:mr-4">
          Utilizziamo i cookie per migliorare la tua esperienza e per finalità analitiche, previo tuo consenso. 
          Per maggiori dettagli, consulta la nostra{' '}
          <Link to="/page/privacy-policy" className="underline hover:text-primary-200">
            Informativa Privacy e Cookie Policy
          </Link>.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={declineConsent}
            className="px-4 py-2 text-sm font-medium rounded-md bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-800 focus:ring-white"
            aria-label="Rifiuta cookie"
          >
            Rifiuta
          </button>
          <button
            onClick={giveConsent}
            className="px-4 py-2 text-sm font-medium rounded-md bg-green-500 hover:bg-green-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-800 focus:ring-green-300"
            aria-label="Accetta cookie"
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
