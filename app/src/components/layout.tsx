'use client';

import React from 'react';
import Link from 'next/link';

const Header = () => (
  <header className="bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg">
    <div className="container mx-auto flex justify-between items-center p-4">
      <Link href="/" className="text-2xl font-bold">DHA Health Portal</Link>
      <nav className="space-x-6">
        <Link href="/#features" className="hover:underline">Features</Link>
        <Link href="/#ai-assistant" className="hover:underline">AI Assistant</Link>
      </nav>
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-gray-800 text-white p-6 mt-12">
    <div className="container mx-auto text-center">
      <div className="mb-4">
        <Link href="/legal/privacy-policy" className="mx-2 hover:underline">Privacy Policy</Link>
        <Link href="/legal/terms-of-service" className="mx-2 hover:underline">Terms of Service</Link>
      </div>
      <p className="text-sm">
        Disclaimer: This is not a licensed medical professional. The information provided is for general knowledge and informational purposes only, and does not constitute medical advice.
      </p>
      <p className="text-xs mt-2">
        Emergency Providers: Dubai Police 999, Ambulance 998
      </p>
    </div>
  </footer>
);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 