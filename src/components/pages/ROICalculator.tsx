// ROI Calculator display component
interface ROICalculatorProps {
  currentSpend: number;
  currentRevenue: number;
  roiCopy: string;
}

export function ROICalculator({ currentSpend, currentRevenue, roiCopy }: ROICalculatorProps) {
  // Calculate projected values (15% spend reduction, 15% revenue increase)
  const projectedSpend = currentSpend * 0.85;
  const projectedRevenue = currentRevenue * 1.15;

  // Calculate ROI percentages
  const currentROI = currentSpend > 0 ? ((currentRevenue / currentSpend) * 100) : 0;
  const projectedROI = projectedSpend > 0 ? ((projectedRevenue / projectedSpend) * 100) : 0;

  // Calculate improvement
  const improvement = projectedROI - currentROI;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (amount: number): string => {
    return `${Math.round(amount)}%`;
  };

  return (
    <section className="py-12 md:py-16 px-5 md:px-8 bg-black">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight text-center mb-8">
          Your Projected ROI with HYROS
        </h3>

        {/* ROI Comparison Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8">
          {/* Current */}
          <div className="glass-card p-6 text-center">
            <p className="text-[var(--hyros-text-muted)] text-sm mb-2">Current</p>
            <p className="text-white text-sm mb-1">
              Spend: {formatCurrency(currentSpend)}
            </p>
            <p className="text-white text-sm mb-3">
              Revenue: {formatCurrency(currentRevenue)}
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-white">
              {formatPercent(currentROI)}
            </p>
            <p className="text-[var(--hyros-text-muted)] text-xs">ROI</p>
          </div>

          {/* Projected */}
          <div className="glass-card p-6 text-center border-[var(--hyros-blue)]">
            <p className="text-[var(--hyros-blue)] text-sm mb-2">With HYROS</p>
            <p className="text-white text-sm mb-1">
              Spend: {formatCurrency(projectedSpend)}
            </p>
            <p className="text-white text-sm mb-3">
              Revenue: {formatCurrency(projectedRevenue)}
            </p>
            <p className="serif-accent text-3xl md:text-4xl text-[var(--hyros-yellow)]">
              {formatPercent(projectedROI)}
            </p>
            <p className="text-[var(--hyros-text-muted)] text-xs">Projected ROI</p>
          </div>
        </div>

        {/* Improvement Banner */}
        <div className="text-center">
          <p className="text-[var(--hyros-text-muted)] mb-2">{roiCopy}</p>
          <p className="text-lg md:text-xl text-white">
            See an estimated{' '}
            <span className="serif-accent text-2xl md:text-3xl text-[var(--hyros-yellow)]">
              {formatPercent(improvement)}
            </span>{' '}
            improvement in your ad ROI
          </p>
        </div>
      </div>
    </section>
  );
}
