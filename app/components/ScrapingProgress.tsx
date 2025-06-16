'use client';

import React from 'react';

export interface ProgressUpdate {
  type: 'progress' | 'complete' | 'error';
  step: string;
  message: string;
  sources: string[];
  status: 'analyzing' | 'searching' | 'web_searching' | 'generating' | 'complete' | 'fallback' | 'starting';
  count?: number;
  details?: Record<string, unknown>;
}

interface ScrapingProgressProps {
  updates: ProgressUpdate[];
  currentStep: string;
}

const getStepIcon = (step: string, status: string) => {
  const isComplete = status === 'complete';
  const isFallback = status === 'fallback';
  const isSearching = status === 'searching' || status === 'web_searching' || status === 'analyzing' || status === 'generating';
  
  if (isComplete) {
    return (
      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  
  if (isFallback) {
    return (
      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
    );
  }
  
  if (isSearching) {
    return (
      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
      <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'complete':
      return 'text-emerald-600';
    case 'fallback':
      return 'text-orange-600';
    case 'searching':
    case 'web_searching':
    case 'analyzing':
    case 'generating':
      return 'text-blue-600';
    default:
      return 'text-slate-600';
  }
};

const getStepLabel = (step: string) => {
  const stepLabels: { [key: string]: string } = {
    'initializing': 'Initializing Research',
    'intent_analysis': 'Understanding Query',
    'intent_complete': 'Query Analysis Complete',
    'intent_fallback': 'Basic Analysis',
    'data_collection_start': 'Starting Data Collection',
    'emergency_search': 'Emergency Facilities',
    'emergency_complete': 'Emergency Search Complete',
    'emergency_fallback': 'Emergency Fallback',
    'facilities_search': 'Healthcare Facilities',
    'facilities_complete': 'Facilities Found',
    'pricing_search': 'Medical Pricing',
    'web_pricing_search': 'Live Pricing Data',
    'web_pricing_complete': 'Live Pricing Found',
    'web_pricing_timeout': 'Using Local Pricing',
    'local_pricing_search': 'Local Pricing Data',
    'pricing_complete': 'Pricing Complete',
    'pricing_fallback': 'Pricing Fallback',
    'insurance_search': 'Insurance Plans',
    'insurance_complete': 'Insurance Found',
    'insurance_fallback': 'Insurance Fallback',
    'medical_info_search': 'Medical Information',
    'medical_info_complete': 'Medical Data Ready',
    'medical_info_fallback': 'Medical Fallback',
    'response_generation': 'Generating Response',
    'response_complete': 'Response Ready',
    'response_fallback': 'Response Fallback'
  };
  
  return stepLabels[step] || step;
};

const ScrapingProgress: React.FC<ScrapingProgressProps> = ({ updates, currentStep }) => {
  const latestUpdate = updates[updates.length - 1];
  
  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
              Researching Your Health Query
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              Gathering information from trusted medical sources
            </p>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="p-4 bg-blue-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          {getStepIcon(currentStep, latestUpdate?.status || 'searching')}
          <div className="flex-1">
            <p className={`font-medium text-sm ${getStatusColor(latestUpdate?.status || 'searching')}`}>
              {latestUpdate?.message || 'Processing your request...'}
            </p>
            {latestUpdate?.count && (
              <p className="text-xs text-slate-600 mt-1">
                Found {latestUpdate.count} result{latestUpdate.count !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sources Being Accessed */}
      {latestUpdate?.sources && latestUpdate.sources.length > 0 && (
        <div className="p-4 border-b border-slate-200">
          <h4 className="font-medium text-slate-800 text-xs sm:text-sm mb-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Trusted Sources
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {latestUpdate.sources.map((source, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg border border-emerald-100 p-2 flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0 animate-pulse"></div>
                <span className="text-xs text-slate-700 truncate">{source}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Timeline */}
      <div className="p-4 max-h-48 overflow-y-auto">
        <h4 className="font-medium text-slate-800 text-xs sm:text-sm mb-3">Research Progress</h4>
        <div className="space-y-3">
          {updates.map((update, index) => (
            <div key={index} className="flex items-start gap-3">
              {getStepIcon(update.step, update.status)}
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-slate-800 font-medium">
                  {getStepLabel(update.step)}
                </p>
                <p className={`text-xs text-slate-600 ${getStatusColor(update.status)}`}>
                  {update.message}
                </p>
                {update.count && (
                  <p className="text-xs text-slate-500 mt-1">
                    {update.count} result{update.count !== 1 ? 's' : ''} found
                  </p>
                )}
              </div>
              <div className="text-xs text-slate-400 flex-shrink-0">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Assurance Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Prioritizing DHA-licensed providers and evidence-based sources</span>
        </div>
      </div>
    </div>
  );
};

export default ScrapingProgress; 