// CTA Button component for close pages
interface CTAButtonProps {
  href: string;
  price: number;
  label: string;
  variant: 'primary' | 'secondary';
}

export function CTAButton({ href, price, label, variant }: CTAButtonProps) {
  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full max-w-md mx-auto text-center py-4 px-8 rounded-full font-medium text-lg transition-all touch-target ${
        variant === 'primary'
          ? 'bg-gradient-to-r from-[var(--hyros-yellow)] to-[var(--hyros-yellow-dark)] text-black hover:opacity-90'
          : 'bg-white text-black hover:bg-gray-100'
      }`}
    >
      <span className="block">{label}</span>
      <span className="block text-sm opacity-80">{formatPrice(price)}</span>
    </a>
  );
}
