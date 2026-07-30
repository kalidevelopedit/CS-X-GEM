export function CtaPanel() {
  return (
    <section 
      className="w-full py-12"
      style={{ 
        backgroundColor: 'var(--section-grey)',
        minHeight: '130px'
      }}
    >
      <div className="max-w-[var(--content-width)] mx-auto px-4 flex items-center justify-center gap-8">
        <h2 
          className="text-[25px] font-normal"
          style={{ color: 'var(--text-primary)' }}
        >
          Take the next step.
        </h2>
        
        <button
          data-testid="button-open-account-footer"
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
    </section>
  );
}
