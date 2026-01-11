// Testimonial component for benefits - displays stat, quote, and attribution
import type { BenefitTestimonial as TestimonialType } from '@/types';

interface BenefitTestimonialProps {
  testimonial: TestimonialType;
  index: number;
}

export function BenefitTestimonial({ testimonial, index }: BenefitTestimonialProps) {
  // Check if testimonial has content
  if (!testimonial.quote) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 px-6 lg:px-8 border-y border-black/5">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
          {/* Stat */}
          <div className="flex-shrink-0">
            <p
              className={`font-serif text-black tracking-[-0.02em] ${
                testimonial.stat.length > 6
                  ? 'text-4xl md:text-5xl italic'
                  : 'text-5xl md:text-6xl'
              }`}
            >
              {testimonial.stat}
            </p>
            <p className="text-sm text-black/40 mt-1">{testimonial.statLabel}</p>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-20 bg-black/10"></div>

          {/* Quote */}
          <div className="flex-1">
            <p className="text-black/60 leading-relaxed mb-6">
              &quot;{testimonial.quote}&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
                <span className="text-black/40 font-medium text-sm">
                  {testimonial.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-black">{testimonial.name}</p>
                <p className="text-xs text-blue-600">{testimonial.company}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
