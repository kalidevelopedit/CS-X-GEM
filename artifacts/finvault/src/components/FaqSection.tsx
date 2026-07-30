import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    id: 'security-guarantee',
    question: 'What is the Schwab Security Guarantee?',
    answer:
      'FinVault will cover 100% of any losses in your Schwab accounts due to unauthorized activity. Our guarantee covers your account against unauthorized access from outside the firm by a third party.',
  },
  {
    id: 'cost',
    question: 'How much does it cost to work with Schwab?',
    answer:
      'Schwab charges $0 online listed equity trades, $0.65 per options contract, and $0 for Schwab ETFs. There are no account minimums for most account types.',
  },
  {
    id: 'open-account',
    question: 'How do I open an account?',
    answer:
      'You can open an account online in minutes. Select "Open an account" and follow the step-by-step process. Most accounts are approved instantly.',
  },
  {
    id: 'investment-products',
    question: 'What kind of investment products does Schwab offer?',
    answer:
      'Schwab offers stocks, bonds, mutual funds, ETFs, options, futures, and more. We also offer managed portfolios and full-service wealth management.',
  },
  {
    id: 'bank',
    question: 'Why should I bank with Charles Schwab Bank?',
    answer:
      'Charles Schwab Bank offers high-yield savings, checking with no monthly fees, ATM fee rebates nationwide, and seamless integration with your brokerage account.',
  },
];

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [allExpanded, setAllExpanded] = useState(false);

  const toggle = (id: string) => {
    if (allExpanded) {
      setAllExpanded(false);
      setOpenId(openId === id ? null : id);
    } else {
      setOpenId(openId === id ? null : id);
    }
  };

  const expandAll = () => {
    setAllExpanded(true);
    setOpenId(null);
  };

  const collapseAll = () => {
    setAllExpanded(false);
    setOpenId(null);
  };

  const isOpen = (id: string) => allExpanded || openId === id;

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-[var(--content-width)] mx-auto px-4">
        <div className="text-center mb-4">
          <h2
            className="text-[34px] font-light mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            We encourage your questions.
          </h2>
          <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>
            Here are answers to some top questions from investors like you:
          </p>
        </div>

        {/* Expand / Collapse All */}
        <div className="flex justify-end mb-4">
          <span className="text-[13px]" style={{ color: 'var(--link-blue)' }}>
            <button
              data-testid="button-expand-all"
              onClick={expandAll}
              className="hover:underline"
            >
              Expand All
            </button>
            {' | '}
            <button
              data-testid="button-collapse-all"
              onClick={collapseAll}
              className="hover:underline"
            >
              Collapse All
            </button>
          </span>
        </div>

        {/* FAQ items */}
        <div>
          {faqs.map((faq) => (
            <div key={faq.id} className="border-b border-gray-200">
              <button
                data-testid={`faq-${faq.id}`}
                className="flex items-center gap-3 w-full text-left py-4 hover:bg-gray-50 transition-colors px-2"
                onClick={() => toggle(faq.id)}
              >
                <span
                  className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center"
                  style={{ backgroundColor: 'var(--login-blue)' }}
                >
                  <ChevronDown
                    size={14}
                    className="text-white transition-transform"
                    style={{
                      transform: isOpen(faq.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </span>
                <span className="text-[15px]" style={{ color: 'var(--text-primary)' }}>
                  {faq.question}
                </span>
              </button>
              {isOpen(faq.id) && (
                <div className="pb-4 px-11">
                  <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
