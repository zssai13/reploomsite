import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/db';
import { TestimonialLogo } from '@/components/TestimonialLogo';

export const dynamic = 'force-dynamic';

export default async function ClosePage1({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page || page.status !== 'ready') {
    notFound();
  }

  const adSpend = page.adSpend || 50000;
  const adRevenue = page.adRevenue || 500000;
  const currentROAS = Math.round((adRevenue / adSpend) * 100);
  const projectedSpend = Math.round(adSpend * 0.85);
  const projectedRevenue = Math.round(adRevenue * 1.15);
  const projectedROAS = Math.round((projectedRevenue / projectedSpend) * 100);

  // Calculate savings and gains
  const adSpendSaved = adSpend - projectedSpend;
  const revenueFromScale = projectedRevenue - adRevenue;
  const roasGainPercent = Math.round(((projectedROAS - currentROAS) / currentROAS) * 100);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-white border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {page.hyrosLogoUrl ? (
              <img src={page.hyrosLogoUrl} alt="HYROS" className="h-6 object-contain" />
            ) : (
              <span className="text-lg font-semibold tracking-[-0.02em]">HYROS</span>
            )}
            <span className="w-px h-5 bg-black/10"></span>
            <span className="text-sm text-black/50">{page.companyName}</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-black tracking-[-0.04em] leading-[1.05]">
            {page.content.headline || (
              <>
                How HYROS Will Grow<br />
                <span className="text-blue-600">{page.companyName}&apos;s</span> Adspend
              </>
            )}
          </h1>
          <div className="w-20 h-px bg-black/20 mx-auto mt-8 mb-6"></div>
          <p className="text-lg md:text-xl text-black/50 max-w-2xl mx-auto">
            {page.content.subheadline || 'This is a custom video on how HYROS will dramatically increase your ad ROI'}
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          {page.loomVideoUrl ? (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={page.loomVideoUrl.replace('share', 'embed')}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-orange-500/20"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_70%)]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                  <svg className="w-7 h-7 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <span className="text-white/60 text-sm">Watch your personalized walkthrough</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA - Annual Package Only */}
      <section className="py-10 px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <p className="text-sm text-black/40 mb-4">Annual Package (Save 20%)</p>
          <a
            href={page.primaryProductLink || '#'}
            className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-colors"
          >
            <span>Get Started Now</span>
            {page.primaryProductPrice && (
              <span className="ml-2 text-white/70">— ${page.primaryProductPrice}</span>
            )}
          </a>
        </div>
      </section>

      {/* 3 Ways Section */}
      <section className="py-16 md:py-20 px-6 lg:px-8 border-t border-black/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-blue-600 uppercase tracking-wider mb-4">Why HYROS</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-black tracking-[-0.03em]">
            The 3 Ways HYROS Will Grow<br />
            <span className="text-blue-600">{page.companyName}&apos;s</span> Ads
          </h2>
        </div>
      </section>

      {/* Benefits + Testimonials - First 3 (The "3 Ways" section) */}
      {page.content.benefits.slice(0, 3).map((benefit, index) => (
        <div key={index}>
          {/* Benefit Section */}
          <section className="py-16 md:py-20 px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-6">
                <div className="w-1 h-16 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-black tracking-[-0.02em] mb-4">
                    {benefit.title}
                  </h2>
                  <p className="text-black/50 text-lg leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonial Section */}
          <section className="py-16 md:py-20 px-6 lg:px-8 border-y border-black/5">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
                {/* Stat */}
                <div className="flex-shrink-0">
                  <p className={`font-serif text-black tracking-[-0.02em] ${
                    benefit.testimonial.stat.length > 5
                      ? 'text-4xl md:text-5xl italic'
                      : 'text-5xl md:text-6xl'
                  }`}>
                    {benefit.testimonial.stat}
                  </p>
                  <p className="text-sm text-black/40 mt-1">{benefit.testimonial.statLabel}</p>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-20 bg-black/10"></div>

                {/* Quote */}
                <div className="flex-1">
                  <p className="text-lg md:text-xl text-black/70 leading-relaxed mb-8 font-medium">
                    &quot;{benefit.testimonial.quote}&quot;
                  </p>
                  <div className="flex items-center gap-4">
                    <TestimonialLogo
                      logoUrl={benefit.testimonial.logoUrl}
                      companyName={benefit.testimonial.company}
                      personName={benefit.testimonial.name}
                      size="lg"
                    />
                    <div>
                      <p className="text-lg font-semibold text-black">{benefit.testimonial.name}</p>
                      <p className="text-base text-blue-600 font-medium">{benefit.testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      ))}

      {/* ROI Calculator */}
      <section className="py-20 md:py-28 px-6 lg:px-8 border-t border-black/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-serif italic text-black tracking-[-0.03em]">
              Your Projected ROI
            </h2>
            <p className="text-black/40 mt-4">Based on ${adSpend.toLocaleString()}/mo ad spend</p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-black/10">
            {/* Current */}
            <div className="bg-white p-8">
              <p className="text-black/30 text-xs uppercase tracking-wider mb-8">Current</p>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-baseline">
                  <span className="text-black/40 text-sm">Ad Spend</span>
                  <span className="text-black text-lg">${adSpend.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-black/40 text-sm">Revenue</span>
                  <span className="text-black text-lg">${adRevenue.toLocaleString()}</span>
                </div>
              </div>
              <div className="pt-6 border-t border-black/5">
                <p className="font-serif text-5xl text-black">{currentROAS}%</p>
                <p className="text-black/30 text-sm mt-1">ROAS</p>
              </div>
            </div>

            {/* With HYROS */}
            <div className="bg-blue-600 p-8">
              <p className="text-white/60 text-xs uppercase tracking-wider mb-8">With HYROS</p>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-sm">Ad Spend</span>
                    <span className="text-yellow-300 text-xs font-semibold">-15% waste</span>
                  </div>
                  <span className="text-white text-lg">${projectedSpend.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-sm">Revenue</span>
                    <span className="text-yellow-300 text-xs font-semibold">+15% better efficiency</span>
                  </div>
                  <span className="text-white text-lg">${projectedRevenue.toLocaleString()}</span>
                </div>
              </div>
              <div className="pt-6 border-t border-white/20 flex items-end justify-between">
                <div>
                  <div className="flex items-baseline gap-3">
                    <p className="font-serif text-5xl text-white">{projectedROAS}%</p>
                    <span className="text-yellow-300 text-xl font-bold">+{roasGainPercent}%</span>
                  </div>
                  <p className="text-white/60 text-sm mt-1">Projected ROAS</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-300 text-sm font-semibold">${adSpendSaved.toLocaleString()} Saved</p>
                  <p className="text-yellow-300 text-sm font-semibold">${revenueFromScale.toLocaleString()} from more scale</p>
                </div>
              </div>
            </div>
          </div>

          {/* ROI Summary Text */}
          <div className="text-center mt-10">
            <p className="text-black/50 max-w-2xl mx-auto">
              {page.content.roiCopy || (
                <>Most businesses see a 15-30% improvement in ROAS within 90 days. For {page.companyName}, that could mean turning your current ad spend into trackable revenue that justifies aggressive scaling of your campaigns.</>
              )}
            </p>
          </div>

          {/* Guarantee Banner - Subtle warning style */}
          <div className="mt-8 bg-yellow-100 border border-yellow-300 rounded-lg px-6 py-4 text-center">
            <p className="text-yellow-800 font-semibold text-base md:text-lg">
              HYROS guarantees these results. If your ads do not grow you do not pay!
            </p>
          </div>
        </div>
      </section>

      {/* 4th Benefit + Testimonial - Industry Specific (After ROI Calculator) */}
      {page.content.benefits[3] && (
        <div>
          {/* Benefit Section */}
          <section className="py-16 md:py-20 px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-6">
                <div className="w-1 h-16 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-black tracking-[-0.02em] mb-4">
                    {page.content.benefits[3].title}
                  </h2>
                  <p className="text-black/50 text-lg leading-relaxed">
                    {page.content.benefits[3].description}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonial Section */}
          <section className="py-16 md:py-20 px-6 lg:px-8 border-y border-black/5">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
                {/* Stat */}
                <div className="flex-shrink-0">
                  <p className={`font-serif text-black tracking-[-0.02em] ${
                    page.content.benefits[3].testimonial.stat.length > 5
                      ? 'text-4xl md:text-5xl italic'
                      : 'text-5xl md:text-6xl'
                  }`}>
                    {page.content.benefits[3].testimonial.stat}
                  </p>
                  <p className="text-sm text-black/40 mt-1">{page.content.benefits[3].testimonial.statLabel}</p>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-20 bg-black/10"></div>

                {/* Quote */}
                <div className="flex-1">
                  <p className="text-lg md:text-xl text-black/70 leading-relaxed mb-8 font-medium">
                    &quot;{page.content.benefits[3].testimonial.quote}&quot;
                  </p>
                  <div className="flex items-center gap-4">
                    <TestimonialLogo
                      logoUrl={page.content.benefits[3].testimonial.logoUrl}
                      companyName={page.content.benefits[3].testimonial.company}
                      personName={page.content.benefits[3].testimonial.name}
                      size="lg"
                    />
                    <div>
                      <p className="text-lg font-semibold text-black">{page.content.benefits[3].testimonial.name}</p>
                      <p className="text-base text-blue-600 font-medium">{page.content.benefits[3].testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* What You Get */}
      <section className="py-20 md:py-28 px-6 lg:px-8 border-t border-black/5">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold text-black tracking-[-0.03em] mb-4">
              What You Get
            </h2>
            <p className="text-black/40 text-lg">
              {page.content.whatYouGetIntro || 'Everything included when you start with HYROS'}
            </p>
          </div>

          {/* Two featured items */}
          <div className="grid md:grid-cols-2 gap-px bg-black/10 mb-px">
            <div className="bg-white p-8 md:p-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-1 h-12 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <p className="text-xs text-blue-600 uppercase tracking-wider mb-2">Core Platform</p>
                  <h3 className="text-xl font-semibold text-black tracking-[-0.01em]">
                    HYROS Tracking Platform
                  </h3>
                </div>
              </div>
              <p className="text-black/50 leading-relaxed pl-5">
                Full access to the most accurate ad tracking system on earth. See every sale, every touchpoint, every dollar.
              </p>
            </div>
            <div className="bg-white p-8 md:p-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-1 h-12 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <p className="text-xs text-blue-600 uppercase tracking-wider mb-2">Attribution</p>
                  <h3 className="text-xl font-semibold text-black tracking-[-0.01em]">
                    Cross-Device Attribution
                  </h3>
                </div>
              </div>
              <p className="text-black/50 leading-relaxed pl-5">
                Track customers across phones, tablets, and desktops. No more lost conversions when they switch devices.
              </p>
            </div>
          </div>

          {/* Four secondary items */}
          <div className="grid md:grid-cols-4 gap-px bg-black/10">
            <div className="bg-white p-6">
              <p className="font-serif text-3xl text-black mb-3">60s</p>
              <h3 className="text-sm font-semibold text-black tracking-[-0.01em] mb-2">
                Real-Time Dashboard
              </h3>
              <p className="text-xs text-black/40 leading-relaxed">
                Live performance data updated every 60 seconds. Make decisions based on what&apos;s happening now.
              </p>
            </div>
            <div className="bg-white p-6">
              <p className="font-serif text-3xl text-black mb-3">AI</p>
              <h3 className="text-sm font-semibold text-black tracking-[-0.01em] mb-2">
                AI Platform Integration
              </h3>
              <p className="text-xs text-black/40 leading-relaxed">
                Feed accurate data directly to Meta, Google, and TikTok. Train their algorithms with real conversions.
              </p>
            </div>
            <div className="bg-white p-6">
              <p className="font-serif text-3xl text-black mb-3">48h</p>
              <h3 className="text-sm font-semibold text-black tracking-[-0.01em] mb-2">
                White-Glove Onboarding
              </h3>
              <p className="text-xs text-black/40 leading-relaxed">
                A dedicated specialist sets everything up for you. Be fully operational in 48 hours, not weeks.
              </p>
            </div>
            <div className="bg-white p-6">
              <p className="font-serif text-3xl text-black mb-3">24/7</p>
              <h3 className="text-sm font-semibold text-black tracking-[-0.01em] mb-2">
                Priority Support
              </h3>
              <p className="text-xs text-black/40 leading-relaxed">
                Direct access to our expert team. Get answers in hours, not days. Your success is our success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-20 md:py-28 px-6 lg:px-8 border-t border-black/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-black tracking-[-0.03em] mb-6">
            90-Day ROI Guarantee
          </h2>
          <p className="text-black/50 leading-relaxed">
            If you don&apos;t see measurable improvement in your ad performance within 90 days, we&apos;ll work with you until you do—or refund your investment. We&apos;re that confident in what HYROS can do for your business.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 px-6 lg:px-8 border-t border-black/5">
        <div className="max-w-md mx-auto text-center">
          <p className="text-sm text-black/40 mb-4">Ready to see real results?</p>
          <a
            href={page.primaryProductLink || '#'}
            className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-colors"
          >
            <span>Get Started Now</span>
            {page.primaryProductPrice && (
              <span className="ml-2 text-white/70">— ${page.primaryProductPrice}</span>
            )}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-8 border-t border-black/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-sm text-black/30">© 2026 HYROS. All rights reserved.</span>
          <span className="text-sm font-semibold tracking-[-0.02em] text-black/20">HYROS</span>
        </div>
      </footer>
    </div>
  );
}
