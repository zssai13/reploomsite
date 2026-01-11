// Testimonial display component
import type { Testimonial as TestimonialType } from '@/types';

interface TestimonialProps {
  testimonial: TestimonialType | null;
  index: number;
}

export function Testimonial({ testimonial, index }: TestimonialProps) {
  // Alternate between light and dark backgrounds (opposite of benefits)
  const isDark = index % 2 !== 0;

  if (!testimonial) {
    // Placeholder testimonial
    return (
      <section
        className={`py-8 md:py-12 px-5 md:px-8 ${
          isDark ? 'bg-black' : 'bg-[var(--hyros-off-white)]'
        }`}
      >
        <div className="max-w-3xl mx-auto">
          <div
            className={`p-6 rounded-2xl ${
              isDark ? 'glass-card' : 'bg-white shadow-sm'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex-shrink-0 ${
                  isDark ? 'bg-white/10' : 'bg-gray-200'
                }`}
              />
              <div className="flex-1">
                <p
                  className={`text-sm italic ${
                    isDark ? 'text-[var(--hyros-text-muted)]' : 'text-[var(--hyros-text-gray)]'
                  }`}
                >
                  "HYROS has completely transformed how we understand our ad performance. We finally know which campaigns actually drive revenue."
                </p>
                <p
                  className={`text-xs mt-2 font-medium ${
                    isDark ? 'text-white' : 'text-[var(--hyros-text-dark)]'
                  }`}
                >
                  — Happy Customer
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`py-8 md:py-12 px-5 md:px-8 ${
        isDark ? 'bg-black' : 'bg-[var(--hyros-off-white)]'
      }`}
    >
      <div className="max-w-3xl mx-auto">
        <div
          className={`p-6 rounded-2xl ${
            isDark ? 'glass-card' : 'bg-white shadow-sm'
          }`}
        >
          <div className="flex items-start gap-4">
            {/* Rounded square avatar - NOT circle */}
            <img
              src={testimonial.imageUrl}
              alt={testimonial.businessName}
              className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <p
                className={`text-xs mb-1 ${
                  isDark ? 'text-[var(--hyros-blue)]' : 'text-[var(--hyros-blue)]'
                }`}
              >
                {testimonial.industry} • {testimonial.businessType}
              </p>
              <p
                className={`text-sm font-medium ${
                  isDark ? 'text-white' : 'text-[var(--hyros-text-dark)]'
                }`}
              >
                {testimonial.businessName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
