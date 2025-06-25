'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown';
import ProcedureCard, { Procedure } from './ProcedureCard';
import EmergencyCard, { EmergencyFacility } from './EmergencyCard';
import InsuranceCard from './InsuranceCard';
import ScrapingProgress, { ProgressUpdate } from './ScrapingProgress';
import type { InsurancePlan } from '@/lib/insurance';

interface SalesFunnelMessage {
  role: 'user' | 'assistant';
  content: string;
  step?: 'medical_answer' | 'ask_for_help' | 'show_facilities' | 'show_insurance';
  emergencyFacilities?: EmergencyFacility[];
  regularFacilities?: Procedure[];
  pricing?: Procedure[];
  insurancePlans?: InsurancePlan[];
  showFindProvidersButton?: boolean;
}

const SalesFunnelResponse = ({ msg, onFindProviders }: { msg: SalesFunnelMessage; onFindProviders?: () => void }) => {
  const components: Components = {
    p: ({ ...props }) => <p className="mb-3 last:mb-0 text-slate-700 leading-relaxed text-sm sm:text-base" {...props} />,
    h1: ({ ...props }) => <h1 className="text-lg sm:text-2xl font-bold text-slate-800 mb-3 pb-2 border-b border-slate-200" {...props} />,
    h2: ({ ...props }) => <h2 className="text-base sm:text-xl font-semibold text-slate-800 mb-2 mt-4" {...props} />,
    h3: ({ ...props }) => <h3 className="text-sm sm:text-lg font-medium text-slate-700 mb-2 mt-3" {...props} />,
    ul: ({ ...props }) => <ul className="list-disc list-inside mb-3 space-y-1 text-slate-700 text-sm sm:text-base" {...props} />,
    ol: ({ ...props }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-slate-700 text-sm sm:text-base" {...props} />,
    li: ({ ...props }) => <li className="mb-1" {...props} />,
    strong: ({ ...props }) => <strong className="font-semibold text-slate-800" {...props} />,
    em: ({ ...props }) => <em className="italic text-slate-600" {...props} />,
    blockquote: ({ ...props }) => <blockquote className="border-l-4 border-emerald-300 pl-3 italic text-slate-600 my-3 bg-emerald-50 py-2 rounded-r-lg text-sm" {...props} />,
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Medical Answer Section */}
      {(msg.step === 'medical_answer' || msg.step === 'ask_for_help') && (
        <div className="p-4 sm:p-6">
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown components={components}>{msg.content}</ReactMarkdown>
          </div>
          
          {msg.showFindProvidersButton && onFindProviders && (
            <div className="mt-6 text-center">
              <button
                onClick={onFindProviders}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                Yes, Help Me Find Healthcare Providers
              </button>
            </div>
          )}
        </div>
      )}

      {/* Facilities Section */}
      {(msg.step === 'show_facilities' || msg.step === 'show_insurance') && (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {msg.emergencyFacilities && msg.emergencyFacilities.length > 0 && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm sm:text-base">Emergency Care Available</span>
              </h3>
              <div className="space-y-3">
                {msg.emergencyFacilities.map((f, i) => (
                  <EmergencyCard 
                    key={`em-${i}`} 
                    facility={f} 
                  />
                ))}
              </div>
            </div>
          )}
          
          {msg.regularFacilities && msg.regularFacilities.length > 0 && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm sm:text-base">Recommended Healthcare Facilities</span>
              </h3>
              <div className="space-y-3">
                {msg.regularFacilities.map((f, i) => (
                  <ProcedureCard 
                    key={`reg-${i}`} 
                    procedure={f} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Insurance Section */}
      {msg.step === 'show_insurance' && (
        <div className="p-4 sm:p-6 border-t border-slate-200">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm sm:text-base">Recommended Insurance Plans</span>
          </h3>
          {msg.insurancePlans && msg.insurancePlans.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {msg.insurancePlans.map((p, i) => (
                <InsuranceCard 
                  key={`in-${i}`} 
                  plan={p} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-2">Insurance Information Available</h3>
              <p className="text-slate-600 mb-3 text-xs sm:text-sm">Contact our insurance specialists for personalized coverage options.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const LoadingWithProgress = ({ updates, currentStep }: { updates: ProgressUpdate[], currentStep: string }) => (
  <div className="flex justify-start">
    <div className="w-full max-w-[95%] sm:max-w-[85%]">
      <ScrapingProgress updates={updates} currentStep={currentStep} />
    </div>
  </div>
);

const Chat = () => {
  const [messages, setMessages] = useState<SalesFunnelMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
  const [currentStep, setCurrentStep] = useState('');
  const [waitingForProviders, setWaitingForProviders] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isLoading]);

  const handleFindProviders = async () => {
    if (!currentQuery) return;
    
    setWaitingForProviders(true);
    setIsLoading(true);
    setProgressUpdates([]);
    setCurrentStep('searching_providers');

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentQuery, findProviders: true }),
      });
      
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');
      
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) { 
          setIsLoading(false); 
          setWaitingForProviders(false);
          break; 
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'progress') {
                setProgressUpdates(prev => [...prev, data]);
                setCurrentStep(data.step);
              } else if (data.type === 'complete') {
                // Add facilities step
                setMessages(prev => [...prev, { 
                  role: 'assistant', 
                  content: 'Here are healthcare facilities and insurance options for your condition:',
                  step: 'show_facilities',
                  emergencyFacilities: data.emergencyFacilities,
                  regularFacilities: data.regularFacilities,
                  pricing: data.pricing,
                  insurancePlans: data.insurancePlans
                }]);
                
                // Add insurance step if there are insurance plans
                if (data.insurancePlans && data.insurancePlans.length > 0) {
                  setTimeout(() => {
                    setMessages(prev => [...prev, { 
                      role: 'assistant', 
                      content: '',
                      step: 'show_insurance',
                      insurancePlans: data.insurancePlans
                    }]);
                  }, 1000);
                }
                
                setIsLoading(false);
                setWaitingForProviders(false);
                setProgressUpdates([]);
              } else if (data.type === 'error') {
                setMessages(prev => [...prev, { 
                  role: 'assistant', 
                  content: data.message,
                  step: 'medical_answer'
                }]);
                setIsLoading(false);
                setWaitingForProviders(false);
              }
            } catch (e) { 
              console.error('SSE parse error', e); 
            }
          }
        }
      }
    } catch (err) {
      console.error('Provider search error:', err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'An error occurred while searching for providers. Please try again.',
        step: 'medical_answer'
      }]);
      setIsLoading(false);
      setWaitingForProviders(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage: SalesFunnelMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setCurrentQuery(userInput);
    setInput('');
    setIsLoading(true);
    setProgressUpdates([]);
    setCurrentStep('initializing');

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });
      
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');
      
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) { setIsLoading(false); break; }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'progress') {
                setProgressUpdates(prev => [...prev, data]);
                setCurrentStep(data.step);
              } else if (data.type === 'complete') {
                // Add medical answer with find providers button
                setMessages(prev => [...prev, { 
                  role: 'assistant', 
                  content: data.response,
                  step: 'ask_for_help',
                  showFindProvidersButton: true,
                  emergencyFacilities: data.emergencyFacilities,
                  regularFacilities: data.regularFacilities,
                  pricing: data.pricing,
                  insurancePlans: data.insurancePlans
                }]);
                setIsLoading(false);
                setProgressUpdates([]);
              } else if (data.type === 'error') {
                setMessages(prev => [...prev, { 
                  role: 'assistant', 
                  content: data.message,
                  step: 'medical_answer'
                }]);
                setIsLoading(false);
              }
            } catch (e) { 
              console.error('SSE parse error', e); 
            }
          }
        }
      }
    } catch (err) {
      console.error('Chat submission error:', err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'An error occurred. Please try again.',
        step: 'medical_answer'
      }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <div className="text-center px-3 sm:px-6 py-4 sm:py-6 pb-3 sm:pb-4 border-b border-slate-200 bg-white">
        <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          AI Health Assistant
        </h2>
        <p className="text-slate-600 mt-1 sm:mt-2 text-xs sm:text-base">Get medical advice and find healthcare providers in Dubai</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 bg-white space-y-4 sm:space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-xl font-semibold text-slate-800 mb-2">Describe Your Health Concern</h3>
            <p className="text-slate-600 max-w-sm mx-auto text-sm sm:text-base px-4">
              Tell me about your symptoms and I&apos;ll provide medical advice and help you find the right healthcare providers in Dubai.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`rounded-2xl w-full ${
                msg.role === 'user' 
                  ? 'max-w-[85%] sm:max-w-[75%] bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3 sm:p-4 shadow-lg' 
                  : 'max-w-[95%] sm:max-w-[85%]'
              }`}
            >
              {msg.role === 'assistant' ? (
                <SalesFunnelResponse msg={msg} onFindProviders={handleFindProviders} />
              ) : (
                <p className="leading-relaxed text-sm sm:text-base">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && <LoadingWithProgress updates={progressUpdates} currentStep={currentStep} />}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 bg-white border-t border-slate-200 px-3 sm:px-6 py-3 sm:py-4 shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              placeholder="My neck hurts..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border-2 border-slate-200 p-3 sm:p-4 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white shadow-sm text-sm sm:text-base"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 sm:px-6 rounded-xl disabled:opacity-50 hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 min-w-[48px] sm:min-w-[56px] flex items-center justify-center" 
              disabled={!input.trim() || isLoading}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat; 