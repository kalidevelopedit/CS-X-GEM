export function HeroSection() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-[var(--content-width)] mx-auto px-4">
        <div className="grid grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <h1 
              className="text-[44px] leading-[1.1] font-light"
              style={{ color: 'var(--text-primary)' }}
            >
              Manage your wealth,<br />
              your way.
            </h1>
            
            <p 
              className="text-[17px] leading-[1.5]"
              style={{ color: 'var(--text-primary)' }}
            >
              Invest on your own, trade on our platform, and get full-service wealth management all in one place.
            </p>

            <button
              data-testid="button-open-account-hero"
              className="px-8 h-[47px] text-white font-bold text-[16px] hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: 'var(--cta-orange)',
                borderRadius: '24px',
                boxShadow: '0 3px 8px rgba(200, 106, 0, 0.3)'
              }}
            >
              Open an account
            </button>
          </div>

          {/* Right Column - Gradient Typography Art */}
          <div className="relative h-[400px] flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="text-[20px] font-bold" style={{ color: 'var(--text-primary)' }}>
                As many ways to
              </div>
              
              <div className="relative inline-block">
                {/* Hot pink square accent */}
                <div 
                  className="absolute -top-4 left-0 w-[12px] h-[12px]"
                  style={{ backgroundColor: '#E91E8C' }}
                />
                
                <div 
                  className="text-[130px] font-black lowercase leading-[0.9]"
                  style={{
                    background: 'linear-gradient(to right, #E91E8C, #FF6B35, #9C27B0, #00BCD4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  invest
                </div>
              </div>
              
              <div className="text-[20px] font-bold" style={{ color: 'var(--text-primary)' }}>
                as there are investors.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
