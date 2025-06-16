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
  emergencyFacilities?: EmergencyFacility[];
  regularFacilities?: Procedure[];
  pricing?: Procedure[];
  insurancePlans?: InsurancePlan[];
  isEmergency?: boolean;
  specialty?: string;
  nextStep?: string;
}

const AssistantResponse = ({ 
  msg, 
  onFacilityClick, 
  onInsuranceClick 
}: { 
  msg: SalesFunnelMessage;
  onFacilityClick: (facility: Procedure) => void;
  onInsuranceClick: (insurance: InsurancePlan) => void;
}) => {
  const [activeTab, setActiveTab] = useState('advice');
  
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

  // All tabs are always present now
  const tabs = [
    { 
      id: 'advice', 
      label: 'Health Advice', 
      shortLabel: 'Advice',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'emerald',
      count: 1
    },
    { 
      id: 'facilities', 
      label: 'Facilities & Pricing', 
      shortLabel: 'Facilities',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'teal',
      count: (msg.emergencyFacilities?.length || 0) + (msg.regularFacilities?.length || 0) + (msg.pricing?.length || 0)
    },
    { 
      id: 'insurance', 
      label: 'Insurance Plans', 
      shortLabel: 'Insurance',
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'blue',
      count: msg.insurancePlans?.length || 0
    }
  ];

  const getTabStyles = (tab: typeof tabs[0], isActive: boolean) => {
    const baseStyles = "flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-3 sm:py-3 text-xs sm:text-sm font-medium focus:outline-none transition-all duration-200 rounded-lg border-2 flex-1 min-h-[44px] relative";
    const colorClasses = {
      emerald: isActive 
        ? 'border-emerald-500 text-emerald-700 bg-emerald-50 shadow-md' 
        : 'border-emerald-200 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300',
      teal: isActive 
        ? 'border-teal-500 text-teal-700 bg-teal-50 shadow-md' 
        : 'border-teal-200 text-slate-600 hover:text-teal-600 hover:bg-teal-50 hover:border-teal-300',
      blue: isActive 
        ? 'border-blue-500 text-blue-700 bg-blue-50 shadow-md' 
        : 'border-blue-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300',
    };
    return `${baseStyles} ${colorClasses[tab.color as keyof typeof colorClasses]}`;
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Mobile-First Tab Navigation */}
      <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200">
        <div className="flex gap-2 sm:gap-3">
        {tabs.map(tab => (
          <button
            key={tab.id}
              className={getTabStyles(tab, activeTab === tab.id)}
            onClick={() => setActiveTab(tab.id)}
          >
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-1">
                  {tab.icon}
                  {tab.count > 0 && (
                    <span className="bg-white rounded-full px-1.5 py-0.5 text-xs font-bold min-w-[18px] h-[18px] flex items-center justify-center">
                      {tab.count}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden text-[10px] leading-tight text-center">{tab.shortLabel}</span>
              </div>
          </button>
        ))}
        </div>
      </div>
      
      {/* Content Area - No internal scroll, expands to fit content */}
      <div className="overflow-hidden">
        <div className="transition-all duration-200 ease-in-out">
          {activeTab === 'advice' && (
            <div className="p-4 sm:p-6 animate-fade-in-up">
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown components={components}>{msg.content}</ReactMarkdown>
              </div>
            </div>
          )}
          
          {activeTab === 'facilities' && (
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 animate-fade-in-up">
              {msg.isEmergency && msg.emergencyFacilities && msg.emergencyFacilities.length > 0 && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-sm sm:text-base">Emergency Care</span>
                  </h3>
                  <div className="space-y-3">
                    {msg.emergencyFacilities.map((f, i) => <EmergencyCard key={`em-${i}`} facility={f} />)}
                  </div>
                </div>
              )}

              {!msg.isEmergency && msg.regularFacilities && msg.regularFacilities.length > 0 && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-sm sm:text-base">Healthcare Facilities</span>
                  </h3>
                  <div className="space-y-3">
                    {msg.regularFacilities.map((f, i) => (
                      <div key={`reg-${i}`} className="bg-white rounded-lg border border-emerald-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 text-sm sm:text-base">{f.name}</h4>
                            {f.address && (
                              <p className="text-slate-600 text-xs sm:text-sm mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {f.address}
                              </p>
                            )}
                            {f.phone && (
                              <p className="text-slate-600 text-xs sm:text-sm mt-1 flex items-center gap-1">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {f.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {msg.pricing && msg.pricing.length > 0 && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="text-sm sm:text-base">Services & Pricing</span>
                  </h3>
                  <div className="space-y-3">
                    {msg.pricing.map((p, i) => <ProcedureCard key={`pr-${i}`} procedure={p} />)}
                  </div>
                </div>
              )}
              
              {(!msg.isEmergency || msg.emergencyFacilities.length === 0) && 
               (!msg.regularFacilities || msg.regularFacilities.length === 0) &&
               (!msg.pricing || msg.pricing.length === 0) && (
                <div className="text-center py-6 sm:py-8 text-slate-500">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="text-sm sm:text-lg">No specific facilities found for this query.</p>
                  <p className="text-xs sm:text-sm mt-2">General healthcare facilities and pricing estimates will be provided based on your health needs.</p>
                </div>
              )}
              </div>
            )}
          
            {activeTab === 'insurance' && (
            <div className="p-4 sm:p-6 animate-fade-in-up">
              {msg.insurancePlans && msg.insurancePlans.length > 0 ? (
                <>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-sm sm:text-base">Recommended Plans</span>
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {msg.insurancePlans.map((p, i) => <InsuranceCard key={`in-${i}`} plan={p} />)}
                  </div>
                </>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-2">Insurance Recommendations</h3>
                  <p className="text-slate-600 mb-3 text-xs sm:text-sm">Based on your health query, here are some general insurance recommendations:</p>
                  <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-left">
                    <ul className="text-xs sm:text-sm text-slate-700 space-y-1 sm:space-y-2">
                      <li>• Consider comprehensive health insurance with outpatient coverage</li>
                      <li>• Look for plans that cover preventive care and regular check-ups</li>
                      <li>• Ensure your plan includes coverage for specialist consultations</li>
                      <li>• Check if emergency care and hospital admission are covered</li>
                      <li>• Review prescription medication coverage if applicable</li>
                    </ul>
                  </div>
                </div>
              )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

const LoadingIndicator = ({ currentStep }: { currentStep: string }) => (
  <div className="flex justify-start">
    <div className="max-w-3xl p-4 rounded-lg bg-gray-100">
      <div className="flex items-center space-x-2">
        <div className="animate-spin h-5 w-5 border-b-2 border-blue-500 rounded-full"></div>
        <span className="text-sm text-gray-600">
          {currentStep || 'Processing your request...'}
        </span>
      </div>
    </div>
  </div>
);

const Chat = () => {
  const [messages, setMessages] = useState<SalesFunnelMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isLoading]);

  const handleFacilityClick = (facility: Procedure) => {
    console.log('Facility clicked:', facility); // For analytics
    const followUpMessage: SalesFunnelMessage = {
      role: 'assistant',
      content: `Great choice! ${facility.clinicname} is excellent for ${facility.service}. You can call them at ${facility.phone} or visit them at ${facility.address}. Would you like to explore insurance options for this?`
    };
    setMessages(prev => [...prev, followUpMessage]);
  };

  const handleInsuranceClick = (insurance: InsurancePlan) => {
    console.log('Insurance clicked:', insurance); // For analytics
    const followUpMessage: SalesFunnelMessage = {
      role: 'assistant',
      content: `The ${insurance.planName} from ${insurance.provider} is a solid choice. It covers: ${insurance.benefits.join(', ')}. Would you like to find providers that accept this plan?`
    };
    setMessages(prev => [...prev, followUpMessage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: SalesFunnelMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);
    setCurrentStep('Analyzing your query...');

    try {
      // Use the original stream endpoint, which now has the sales funnel logic
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput, step: 'initial' }),
      });

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');
      
      const decoder = new TextDecoder();
      let assistantMessage: SalesFunnelMessage | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'progress') {
                setCurrentStep(data.message || data.step);
              } else if (data.type === 'complete') {
                assistantMessage = { 
                  role: 'assistant', 
                  content: data.response,
                  emergencyFacilities: data.emergencyFacilities || [],
                  regularFacilities: data.regularFacilities || [],
                  pricing: data.pricing || [],
                  insurancePlans: data.insurancePlans || [],
                  isEmergency: data.isEmergency,
                  specialty: data.specialty,
                  nextStep: data.nextStep,
                };
              } else if (data.type === 'error') {
                assistantMessage = { role: 'assistant', content: data.message };
              }
            } catch (e) {
              console.error('SSE parse error', e);
            }
          }
        }
      }

      if (assistantMessage) {
        setMessages((prev) => [...prev, assistantMessage]);
      }
      
    } catch (err) {
      console.error('Chat submission error:', err);
      const errorMessage: SalesFunnelMessage = { 
        role: 'assistant', 
        content: 'I apologize, but there was an error processing your request. Please try again.'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setCurrentStep('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <div className="text-center px-3 sm:px-6 py-4 sm:py-6 pb-3 sm:pb-4 border-b border-slate-200 bg-white">
        <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          AI Health Assistant
        </h2>
        <p className="text-slate-600 mt-1 sm:mt-2 text-xs sm:text-base">Ask anything about your health, get instant advice and recommendations</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 bg-white space-y-4 sm:space-y-6">
        {messages.length === 0 && (
           <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-xl font-semibold text-slate-800 mb-2">Start Your Health Conversation</h3>
            <p className="text-slate-600 max-w-sm mx-auto text-sm sm:text-base px-4">
              Ask about symptoms, find medical facilities, get pricing information, or seek health advice. I&apos;m here to help!
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
                <AssistantResponse 
                  msg={msg} 
                  onFacilityClick={handleFacilityClick} 
                  onInsuranceClick={handleInsuranceClick}
                />
              ) : (
                <p className="leading-relaxed text-sm sm:text-base">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && <LoadingIndicator currentStep={currentStep} />}
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