import Image from 'next/image';

interface Procedure {
  clinicname: string;
  service: string;
  cashprice?: string;
  address?: string;
  phone?: string;
  source?: string;
  imageUrl?: string;
}

interface ProcedureCardProps {
  procedure: Procedure;
}

const ProcedureCard: React.FC<ProcedureCardProps> = ({ procedure }) => {
  const hasImage = procedure.imageUrl && procedure.imageUrl.trim() !== '';
  
  return (
    <div className="group bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image Section - Smaller on mobile */}
        <div className="w-full h-20 sm:w-24 sm:h-24 relative flex-shrink-0 bg-gradient-to-br from-teal-50 to-emerald-50">
          {hasImage ? (
            <Image 
              src={procedure.imageUrl!} 
              alt={`${procedure.clinicname} facility`} 
              fill
              className="object-cover"
              onError={() => {
                // If image fails to load, show fallback
                console.log('Image failed to load:', procedure.imageUrl);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Content Section - Better mobile layout */}
        <div className="flex-1 p-3 sm:p-5">
          <div className="flex justify-between items-start mb-2 sm:mb-3">
            <h4 className="font-bold text-base sm:text-lg text-slate-800 group-hover:text-teal-700 transition-colors leading-tight pr-2">
              {procedure.clinicname}
            </h4>
            {procedure.source && (
              <span className="text-[10px] sm:text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full whitespace-nowrap">
                {procedure.source}
              </span>
            )}
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-slate-700 font-medium text-xs sm:text-sm">{procedure.service}</p>
            </div>
            
            {procedure.cashprice ? (
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="text-lg sm:text-xl font-bold text-emerald-600">{procedure.cashprice}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-slate-500 italic text-xs sm:text-sm">Contact for pricing</span>
              </div>
            )}

            {procedure.address && (
              <div className="flex items-start gap-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{procedure.address}</p>
              </div>
            )}

            {procedure.phone && (
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${procedure.phone}`} className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors text-xs sm:text-sm">
                  {procedure.phone}
                </a>
              </div>
            )}
          </div>
          
          {/* Action Button - Better mobile sizing */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100">
            <button className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium hover:from-teal-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105 active:scale-95 text-xs sm:text-sm min-h-[40px] sm:min-h-[44px]">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcedureCard;
export type { Procedure }; 