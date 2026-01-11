// HYROS-style sales page - clean styling with original page format
// Updated: force refresh
const data = {
  companyName: 'Acquisition.com',
  headline: "Stop Flying Blind on Your Ad Spend",
  subheadline: "HYROS tracks 30-50% more sales, so you scale winners and kill losers with confidence.",
  loomVideoUrl: 'https://www.loom.com/embed/1234567890',
  benefits: [
    {
      title: 'Scale Winners, Kill Losers Fast',
      description: "Your portfolio companies need real data, not Facebook's guesses. HYROS reveals which ads actually drive acquisitions so you can double down on winners and cut losers before they burn cash. Stop making scaling decisions based on incomplete platform data.",
      testimonial: {
        quote: "Hyros allowed us to scale our ad spend by 43% for business mastery and over 100% for unleash the power within.",
        name: "Tony Robbins",
        company: "tonyrobbins.com",
        stat: "43%",
        statLabel: "growth"
      }
    },
    {
      title: 'Portfolio-Wide Attribution Intelligence',
      description: "Track customer journeys across multiple touchpoints and long sales cycles typical in your premium solutions business. See which marketing channels actually contribute to high-value client acquisitions, not just clicks and impressions that mean nothing to your bottom line.",
      testimonial: {
        quote: "You have transparency in all ad tracking. The people that are attracted to HYROS are psychos about numbers / tracking growth like me.",
        name: "Alex Hormozi",
        company: "acquisition.com",
        stat: "Transparent",
        statLabel: "ad tracking"
      }
    },
    {
      title: 'Feed Clean Data Back to Ad Platforms',
      description: "HYROS doesn't just show you better data—it trains Facebook and Google's algorithms with accurate conversion information. This means the platforms find more qualified business owners and entrepreneurs who actually buy your premium solutions, not tire-kickers.",
      testimonial: {
        quote: "Hyros has had a massive impact when tracking and optimizing ads for peak revenue. Almost all businesses doing 7+ figures per month swear by Hyros.",
        name: "Whop",
        company: "whop.com",
        stat: "100k+",
        statLabel: "active businesses"
      }
    },
  ],
  stats: {
    adSpend: 50000,
    adRevenue: 150000,
  },
  whatYouGet: [
    {
      title: 'HYROS Tracking Platform',
      description: 'Full access to the most accurate ad tracking system on earth. See every sale, every touchpoint, every dollar.',
      icon: 'chart',
    },
    {
      title: 'Cross-Device Attribution',
      description: 'Track customers across phones, tablets, and desktops. No more lost conversions when they switch devices.',
      icon: 'devices',
    },
    {
      title: 'Real-Time Dashboard',
      description: 'Live performance data updated every 60 seconds. Make decisions based on what\'s happening now, not last week.',
      icon: 'dashboard',
    },
    {
      title: 'AI Platform Integration',
      description: 'Feed accurate data directly to Meta, Google, and TikTok. Train their algorithms with real conversions.',
      icon: 'ai',
    },
    {
      title: 'White-Glove Onboarding',
      description: 'A dedicated specialist sets everything up for you. Be fully operational in 48 hours, not weeks.',
      icon: 'support',
    },
    {
      title: 'Priority Support',
      description: 'Direct access to our expert team. Get answers in hours, not days. Your success is our success.',
      icon: 'priority',
    },
  ],
};

export default function ExamplePage() {
  const currentROAS = Math.round((data.stats.adRevenue / data.stats.adSpend) * 100);
  const projectedSpend = Math.round(data.stats.adSpend * 0.85);
  const projectedRevenue = Math.round(data.stats.adRevenue * 1.15);
  const projectedROAS = Math.round((projectedRevenue / projectedSpend) * 100);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-white border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-lg font-semibold tracking-[-0.02em]">HYROS</span>
            <span className="w-px h-5 bg-black/10"></span>
            <span className="text-sm text-black/50">{data.companyName}</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-black tracking-[-0.04em] leading-[1.05]">
            How HYROS Will Grow<br />
            <span className="text-blue-600">{data.companyName}&apos;s</span> Adspend
          </h1>
          <div className="w-20 h-px bg-black/20 mx-auto mt-8 mb-6"></div>
          <p className="text-lg md:text-xl text-black/50 max-w-2xl mx-auto">
            This is a custom video on how HYROS will dramatically increase your ad ROI
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {/* Abstract gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-orange-500/20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_70%)]"></div>

            {/* Play button */}
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
        </div>
      </section>

      {/* 3 Ways Section */}
      <section className="py-16 md:py-20 px-6 lg:px-8 border-t border-black/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-blue-600 uppercase tracking-wider mb-4">Why HYROS</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-black tracking-[-0.03em]">
            The 3 Ways HYROS Will Grow<br />
            <span className="text-blue-600">{data.companyName}&apos;s</span> Ads
          </h2>
        </div>
      </section>

      {/* Benefits + Testimonials - Alternating */}
      {data.benefits.map((benefit, index) => (
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
                    benefit.testimonial.stat === 'Transparent'
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
                  <p className="text-black/60 leading-relaxed mb-6">
                    &quot;{benefit.testimonial.quote}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
                      <span className="text-black/40 font-medium text-sm">
                        {benefit.testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">{benefit.testimonial.name}</p>
                      <p className="text-xs text-blue-600">{benefit.testimonial.company}</p>
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
            <h2 className="text-3xl md:text-5xl font-semibold text-black tracking-[-0.03em]">
              Your Projected ROI
            </h2>
            <p className="text-black/40 mt-4">Based on ${data.stats.adSpend.toLocaleString()}/mo ad spend</p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-black/10">
            {/* Current */}
            <div className="bg-white p-8">
              <p className="text-black/30 text-xs uppercase tracking-wider mb-8">Current</p>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-baseline">
                  <span className="text-black/40 text-sm">Ad Spend</span>
                  <span className="text-black text-lg">${data.stats.adSpend.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-black/40 text-sm">Revenue</span>
                  <span className="text-black text-lg">${data.stats.adRevenue.toLocaleString()}</span>
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
                <div className="flex justify-between items-baseline">
                  <span className="text-white/60 text-sm">Ad Spend</span>
                  <span className="text-white text-lg">${projectedSpend.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-white/60 text-sm">Revenue</span>
                  <span className="text-white text-lg">${projectedRevenue.toLocaleString()}</span>
                </div>
              </div>
              <div className="pt-6 border-t border-white/20">
                <p className="font-serif text-5xl text-white">{projectedROAS}%</p>
                <p className="text-white/60 text-sm mt-1">Projected ROAS</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="text-black/50">
              See an estimated <span className="text-black font-medium">{projectedROAS - currentROAS}% improvement</span> in your ad ROI
            </p>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 md:py-28 px-6 lg:px-8 border-t border-black/5">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-semibold text-black tracking-[-0.03em] mb-4">
              What You Get
            </h2>
            <p className="text-black/40 text-lg">Everything included when you start with HYROS</p>
          </div>

          {/* Two featured items */}
          <div className="grid md:grid-cols-2 gap-px bg-black/10 mb-px">
            <div className="bg-white p-8 md:p-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-1 h-12 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <p className="text-xs text-blue-600 uppercase tracking-wider mb-2">Core Platform</p>
                  <h3 className="text-xl font-semibold text-black tracking-[-0.01em]">
                    {data.whatYouGet[0].title}
                  </h3>
                </div>
              </div>
              <p className="text-black/50 leading-relaxed pl-5">
                {data.whatYouGet[0].description}
              </p>
            </div>
            <div className="bg-white p-8 md:p-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-1 h-12 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
                <div>
                  <p className="text-xs text-blue-600 uppercase tracking-wider mb-2">Attribution</p>
                  <h3 className="text-xl font-semibold text-black tracking-[-0.01em]">
                    {data.whatYouGet[1].title}
                  </h3>
                </div>
              </div>
              <p className="text-black/50 leading-relaxed pl-5">
                {data.whatYouGet[1].description}
              </p>
            </div>
          </div>

          {/* Four secondary items */}
          <div className="grid md:grid-cols-4 gap-px bg-black/10">
            {data.whatYouGet.slice(2).map((item, i) => (
              <div key={i} className="bg-white p-6">
                <p className="font-serif text-3xl text-black mb-3">
                  {i === 0 && '60s'}
                  {i === 1 && 'AI'}
                  {i === 2 && '48h'}
                  {i === 3 && '24/7'}
                </p>
                <h3 className="text-sm font-semibold text-black tracking-[-0.01em] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-black/40 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
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
