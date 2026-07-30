export function ImportantNotice() {
  return (
    <section className="w-full py-10 bg-white">
      <div className="max-w-[var(--content-width)] mx-auto px-4">
        <div
          className="border border-gray-300 px-8 py-6"
          style={{ borderRadius: '2px' }}
        >
          <p
            className="text-[17px] font-bold mb-2 leading-snug"
            style={{ color: 'var(--text-primary)' }}
          >
            Important information about our relationship with you: Client Relationship Summaries
          </p>
          <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Our Client Relationship Summaries offer a brief summary of our services, fees, and obligations when we work with you in a broker-dealer or an investment advisory relationship.{' '}
            <a
              href="#"
              data-testid="link-client-relationship"
              className="hover:underline"
              style={{ color: 'var(--link-blue)' }}
            >
              Learn more at schwab.com/transparency &rsaquo;
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
