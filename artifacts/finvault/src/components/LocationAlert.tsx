import { Info, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function LocationAlert() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div 
      className="w-full px-4 py-5 relative"
      style={{ 
        backgroundColor: 'var(--alert-bg)',
        border: '1px solid var(--alert-border)',
        minHeight: '114px'
      }}
    >
      <div className="max-w-[var(--content-width)] mx-auto">
        <div className="flex items-start gap-4">
          {/* Info Icon */}
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--brand-blue)' }}
          >
            <span className="text-white font-serif italic text-[16px]">i</span>
          </div>

          <div className="flex-1">
            {/* Title */}
            <h3 
              className="text-[17px] mb-3 font-normal"
              style={{ color: 'var(--text-primary)' }}
            >
              Location alert
            </h3>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  data-testid="select-location"
                  className="appearance-none px-4 h-[40px] bg-white border rounded-sm text-[14px] pr-12 cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ 
                    borderColor: 'var(--border-grey)',
                    width: '240px',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option>Select your location</option>
                  <option>New York, NY</option>
                  <option>San Francisco, CA</option>
                  <option>Chicago, IL</option>
                  <option>Boston, MA</option>
                </select>
                <ChevronDown 
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>

              <button
                data-testid="button-go"
                className="h-[40px] px-6 text-white font-bold text-[14px] hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: 'var(--brand-blue)',
                  borderRadius: '22px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
                Go
              </button>
            </div>
          </div>

          {/* Close Button */}
          <button
            data-testid="button-close-alert"
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
