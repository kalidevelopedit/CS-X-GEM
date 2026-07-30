import { Phone, MessageSquare, MapPin, ChevronRight } from 'lucide-react';

export function ContactHelp() {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-[var(--content-width)] mx-auto px-4 text-center">
        <h2
          className="text-[30px] font-light mb-14"
          style={{ color: 'var(--text-primary)' }}
        >
          Have more questions? We're here to help.
        </h2>

        <div className="grid grid-cols-3 gap-12 max-w-2xl mx-auto">
          {/* Call */}
          <div className="flex flex-col items-center gap-4">
            <Phone
              size={48}
              strokeWidth={1.1}
              style={{ color: 'var(--action-blue)' }}
            />
            <p className="text-[18px] font-normal" style={{ color: 'var(--text-primary)' }}>
              Call
            </p>
            <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
              800-435-4000
            </p>
          </div>

          {/* Chat */}
          <div className="flex flex-col items-center gap-4">
            <MessageSquare
              size={48}
              strokeWidth={1.1}
              style={{ color: 'var(--action-blue)' }}
            />
            <p className="text-[18px] font-normal" style={{ color: 'var(--text-primary)' }}>
              Chat
            </p>
            <a
              href="#"
              data-testid="link-chat"
              className="text-[14px] flex items-center gap-1 hover:underline"
              style={{ color: 'var(--link-blue)' }}
            >
              Get live online assistance 24/7 <ChevronRight size={13} />
            </a>
          </div>

          {/* Visit */}
          <div className="flex flex-col items-center gap-4">
            <MapPin
              size={48}
              strokeWidth={1.1}
              style={{ color: 'var(--action-blue)' }}
            />
            <p className="text-[18px] font-normal" style={{ color: 'var(--text-primary)' }}>
              Visit
            </p>
            <a
              href="#"
              data-testid="link-branch"
              className="text-[14px] flex items-center gap-1 hover:underline"
              style={{ color: 'var(--link-blue)' }}
            >
              Find a branch near you <ChevronRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
