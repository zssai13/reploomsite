'use client';

import { useState } from 'react';

interface TestimonialPreviewLogoProps {
  logoUrl?: string | null;
  companyName: string;
}

export function TestimonialPreviewLogo({ logoUrl, companyName }: TestimonialPreviewLogoProps) {
  const [hasError, setHasError] = useState(false);

  // Show fallback if no logo URL or if image failed to load
  if (!logoUrl || hasError) {
    return (
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
        {companyName.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={companyName}
      className="w-8 h-8 rounded-lg object-contain bg-gray-50 border border-gray-100"
      onError={() => setHasError(true)}
    />
  );
}

export default TestimonialPreviewLogo;
