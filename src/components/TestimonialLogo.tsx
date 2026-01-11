'use client';

import { useState } from 'react';

interface TestimonialLogoProps {
  logoUrl?: string;
  companyName: string;
  personName: string;
  size?: 'sm' | 'md' | 'lg';
}

export function TestimonialLogo({ logoUrl, companyName, personName, size = 'md' }: TestimonialLogoProps) {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  }[size];

  // Show fallback if no logo URL or if image failed to load
  if (!logoUrl || hasError) {
    return (
      <div className={`${sizeClasses} bg-black/5 rounded-xl flex items-center justify-center flex-shrink-0`}>
        <span className="text-black/40 font-semibold">
          {personName.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={companyName}
      className={`${sizeClasses} rounded-xl object-contain bg-white border border-black/5 flex-shrink-0`}
      onError={() => setHasError(true)}
    />
  );
}

export default TestimonialLogo;
