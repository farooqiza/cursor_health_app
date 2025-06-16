import { Suspense } from 'react';
import Chat from '@/components/Chat';

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
      {/* Hero Section - Better mobile spacing */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="text-center mb-6 sm:mb-12">
          {/* Logo/Brand - Smaller on mobile */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 animate-scale-in">
            <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                Health Assistant
              </h1>
              <p className="text-xs sm:text-lg text-slate-600 mt-1">Dubai&apos;s Premier Healthcare Guide</p>
            </div>
          </div>

          {/* Main Headline - Better mobile typography */}
          <h2 className="text-lg sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-3 sm:mb-6 leading-tight px-2 animate-fade-in-up animation-delay-200">
            Your Health Journey Starts Here
          </h2>
          
          <p className="text-sm sm:text-xl text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4 animate-fade-in-up animation-delay-300">
            Get instant health advice, find the best medical facilities, compare prices, and discover insurance options—all powered by AI and tailored for Dubai.
          </p>

          {/* Trust Indicators - Better mobile layout */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-6 sm:mb-12 px-4 animate-fade-in-up animation-delay-400">
            <TrustIndicator 
              icon={
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              text="Trusted by 10,000+ Users"
            />
            <TrustIndicator 
              icon={
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              text="Instant AI Responses"
            />
            <TrustIndicator 
              icon={
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
              text="500+ Healthcare Providers"
            />
          </div>
        </div>

        {/* Quick Action Cards - Better mobile grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-12 px-2 animate-fade-in-up animation-delay-500">
          {[
            { icon: '🩺', title: 'Find Doctors', desc: 'Specialists near you', color: 'emerald' },
            { icon: '💊', title: 'Get Prescriptions', desc: 'Pharmacy locations', color: 'teal' },
            { icon: '🏥', title: 'Emergency Care', desc: '24/7 facilities', color: 'red' },
            { icon: '💰', title: 'Compare Prices', desc: 'Best healthcare deals', color: 'blue' }
          ].map((item, index) => (
            <div 
              key={index} 
              className={`bg-white/90 backdrop-blur-sm p-3 sm:p-6 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group border border-${item.color}-100 hover:border-${item.color}-300 animate-fade-in-up`}
              style={{ animationDelay: `${600 + index * 100}ms` }}
            >
              <div className="text-2xl sm:text-4xl mb-2 sm:mb-3 text-center">{item.icon}</div>
              <h3 className="font-bold text-slate-800 mb-1 sm:mb-2 text-xs sm:text-lg group-hover:text-emerald-600 transition-colors text-center">
                {item.title}
              </h3>
              <p className="text-slate-600 text-[10px] sm:text-sm text-center leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Interface - Natural height flow */}
      <div className="bg-white/95 backdrop-blur-sm shadow-2xl border-t border-slate-200 animate-slide-up animation-delay-600">
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-emerald-500"></div>
          </div>
        }>
          <Chat />
        </Suspense>
      </div>

      {/* Footer - More compact on mobile */}
      <footer className="bg-slate-900 text-white py-6 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <div className="text-center sm:text-left">
              <h4 className="font-bold text-base sm:text-lg mb-2 sm:mb-4">Health Assistant</h4>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Your trusted AI companion for healthcare decisions in Dubai.
              </p>
            </div>
            <div className="text-center sm:text-left">
              <h5 className="font-semibold text-sm sm:text-base mb-2 sm:mb-4">Quick Links</h5>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Find Doctors</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Emergency Care</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Insurance Plans</a></li>
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <h5 className="font-semibold text-sm sm:text-base mb-2 sm:mb-4">Support</h5>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <h5 className="font-semibold text-sm sm:text-base mb-2 sm:mb-4">Connect</h5>
              <div className="flex justify-center sm:justify-start space-x-3 sm:space-x-4">
                {[
                  { icon: '📧', label: 'Email' },
                  { icon: '📱', label: 'Phone' },
                  { icon: '💬', label: 'Chat' }
                ].map((item, index) => (
                  <button key={index} className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors text-xs sm:text-base">
                    {item.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-4 sm:pt-8 mt-6 sm:mt-8 text-center">
            <p className="text-slate-400 text-xs sm:text-sm">
              © 2024 Health Assistant. All rights reserved. Made with ❤️ for Dubai&apos;s health community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
