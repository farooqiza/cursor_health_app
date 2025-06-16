import type { InsurancePlan } from '@/lib/insurance';

interface InsuranceCardProps {
  plan: InsurancePlan;
}

const InsuranceCard: React.FC<InsuranceCardProps> = ({ plan }) => {
  return (
    <div className="group bg-white border-2 border-blue-100 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden">
      <div className="p-4 sm:p-6">
        {/* Header - Better mobile layout */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-base sm:text-lg text-slate-800 group-hover:text-blue-700 transition-colors leading-tight">
                {plan.planName}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">{plan.provider}</p>
            </div>
          </div>
          
          <div className="text-left sm:text-right">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">{plan.premium}</div>
            <div className="text-xs sm:text-sm text-slate-500">AED / month</div>
          </div>
        </div>

        {/* Benefits - More compact on mobile */}
        <div className="mb-3 sm:mb-4">
          <h5 className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 sm:mb-3 flex items-center gap-2">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Plan Benefits
          </h5>
          <ul className="space-y-1 sm:space-y-2">
            {plan.benefits.slice(0, 4).map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{benefit}</span>
              </li>
            ))}
            {plan.benefits.length > 4 && (
              <li className="text-xs sm:text-sm text-blue-600 font-medium flex items-center gap-1">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                +{plan.benefits.length - 4} more benefits
              </li>
            )}
          </ul>
        </div>

        {/* Coverage Highlights - Smaller badges on mobile */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
          <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-medium rounded-full">
            <svg className="w-2 h-2 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Comprehensive Coverage
          </span>
          <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] sm:text-xs font-medium rounded-full">
            <svg className="w-2 h-2 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Instant Approval
          </span>
          <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 text-[10px] sm:text-xs font-medium rounded-full">
            <svg className="w-2 h-2 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Fast Claims
          </span>
        </div>

        {/* Action Buttons - Stack on mobile */}
        <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4 border-t border-slate-100">
          <button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm min-h-[44px]">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Select Plan
          </button>
          <button className="flex-1 bg-slate-100 text-slate-700 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium hover:bg-slate-200 transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm min-h-[44px]">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCard; 