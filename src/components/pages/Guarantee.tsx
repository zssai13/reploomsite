// 90-Day Guarantee section
export function Guarantee() {
  return (
    <section className="py-8 md:py-12 px-5 md:px-8 bg-[var(--hyros-off-white)]">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
          <svg
            className="w-5 h-5 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span className="text-sm font-medium text-[var(--hyros-text-dark)]">
            90-Day ROI Guarantee
          </span>
        </div>

        <p className="text-[var(--hyros-text-gray)] text-sm max-w-xl mx-auto">
          If you don't see measurable improvement in your ad performance within 90 days,
          we'll work with you until you do or refund your investment. We're that confident
          in what HYROS can do for your business.
        </p>
      </div>
    </section>
  );
}
