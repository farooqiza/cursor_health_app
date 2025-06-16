'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const ConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleConsent = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 text-center">
      <p className="inline">
        We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
        <Link href="/legal/privacy-policy" className="underline ml-2">
          Learn more
        </Link>
      </p>
      <button onClick={handleConsent} className="bg-blue-500 text-white px-4 py-1 rounded ml-4">
        Accept
      </button>
    </div>
  );
};

export default ConsentBanner; 