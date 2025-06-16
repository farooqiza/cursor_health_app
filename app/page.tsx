import { Suspense } from 'react';
import Chat from '@/components/Chat';
import Hero from '@/components/Hero';
import ConsentBanner from '@/components/ConsentBanner';

const TrustIndicator = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-sm border border-white/20 animate-fade-in-up">
    <div className="text-emerald-600 flex-shrink-0">
      {icon}
    </div>
    <span className="text-slate-700 font-medium text-xs sm:text-sm">{text}</span>
  </div>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Healthcare Assistant
            </h2>
            <Chat />
          </div>
        </div>
      </div>
      <ConsentBanner />
    </main>
  );
}
