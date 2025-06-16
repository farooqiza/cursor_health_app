import Image from 'next/image';

interface EmergencyFacility {
  name: string;
  address: string;
  phone?: string;
  imageUrl?: string;
}

interface EmergencyCardProps {
  facility: EmergencyFacility;
}

const EmergencyCard: React.FC<EmergencyCardProps> = ({ facility }) => {
  const hasImage = facility.imageUrl && facility.imageUrl.trim() !== '';
  
  return (
    <div className="group bg-white border-2 border-red-100 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl hover:border-red-200 transition-all duration-300 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image Section - Smaller on mobile */}
        <div className="w-full h-20 sm:w-24 sm:h-24 relative flex-shrink-0 bg-gradient-to-br from-red-50 to-orange-50">
          {hasImage ? (
            <Image 
              src={facility.imageUrl!} 
              alt={`${facility.name} facility`} 
              fill
              className="object-cover"
              onError={() => {
                console.log('Emergency facility image failed to load:', facility.imageUrl);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          )}
          
          {/* Emergency Badge - Smaller on mobile */}
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
            <div className="bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-0.5 sm:gap-1">
              <svg className="w-2 h-2 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              24/7
            </div>
          </div>
        </div>
        
        {/* Content Section - Better mobile layout */}
        <div className="flex-1 p-3 sm:p-5">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h4 className="font-bold text-base sm:text-lg text-slate-800 group-hover:text-red-700 transition-colors leading-tight">
              {facility.name}
            </h4>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            {facility.address && (
              <div className="flex items-start gap-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{facility.address}</p>
              </div>
            )}

            {facility.phone && (
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${facility.phone}`} className="text-green-600 hover:text-green-800 font-semibold transition-colors text-xs sm:text-sm">
                  {facility.phone}
                </a>
              </div>
            )}
            
            {/* Emergency Services Indicator - Responsive */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
              <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-red-100 text-red-700 text-[10px] sm:text-xs font-medium rounded-full">
                <svg className="w-2 h-2 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Emergency Care
              </span>
              <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-orange-100 text-orange-700 text-[10px] sm:text-xs font-medium rounded-full">
                <svg className="w-2 h-2 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                24/7 Available
              </span>
            </div>
          </div>
          
          {/* Action Buttons - Better mobile layout */}
          <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100">
            {facility.phone && (
              <a 
                href={`tel:${facility.phone}`}
                className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white py-2.5 sm:py-2 px-3 sm:px-4 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 active:scale-95 text-center flex items-center justify-center gap-2 text-xs sm:text-sm min-h-[44px]"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </a>
            )}
            <button className="flex-1 bg-slate-100 text-slate-700 py-2.5 sm:py-2 px-3 sm:px-4 rounded-lg font-medium hover:bg-slate-200 transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm min-h-[44px]">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCard;
export type { EmergencyFacility }; 