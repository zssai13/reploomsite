'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface ReloadData {
  referenceName: string;
  companyName: string;
  businessUrl: string;
  loomVideoUrl: string;
  adSpend: number;
  adRevenue: number;
  primaryProductLink: string;
  primaryProductPrice: number;
  downsellProductLink: string;
  downsellProductPrice: number;
  companyLogoUrl: string;
}

interface ErrorDetails {
  error: string;
  errorCode?: string;
  details?: string;
  timestamp?: string;
}

export default function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);
  const [reloadData, setReloadData] = useState<ReloadData | null>(null);

  // Parse reload data from URL params
  useEffect(() => {
    const reloadParam = searchParams.get('reload');
    if (reloadParam) {
      try {
        const data = JSON.parse(decodeURIComponent(reloadParam)) as ReloadData;
        setReloadData(data);
      } catch {
        console.error('Failed to parse reload data');
      }
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorDetails(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Validate required file uploads
    const logoFile = formData.get('companyLogo') as File;
    const researchFile = formData.get('businessResearch') as File;

    if (!logoFile || logoFile.size === 0) {
      setErrorDetails({ error: 'Company logo is required', errorCode: 'CLIENT_VALIDATION' });
      setLoading(false);
      return;
    }

    if (!researchFile || researchFile.size === 0) {
      setErrorDetails({ error: 'Business research file is required', errorCode: 'CLIENT_VALIDATION' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/admin/pages?created=${data.data.slug}`);
      } else {
        setErrorDetails({
          error: data.error || 'Generation failed',
          errorCode: data.errorCode,
          details: data.details,
          timestamp: data.timestamp,
        });
      }
    } catch (err) {
      setErrorDetails({
        error: 'Network error - could not reach server',
        errorCode: 'NETWORK_ERROR',
        details: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--hyros-text-dark)] mb-6">
        {reloadData ? 'Regenerate Page' : 'Create New Page'}
      </h1>

      {reloadData && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm">
          <p className="font-medium mb-1">Reloading data from: {reloadData.referenceName}</p>
          <p>All fields have been pre-filled. You just need to re-upload the logo and research files.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Reference Name */}
        <div>
          <label className="block text-sm font-medium text-[var(--hyros-text-dark)] mb-2">
            Reference Name *
          </label>
          <input
            type="text"
            name="referenceName"
            required
            defaultValue={reloadData?.referenceName || ''}
            placeholder="e.g., Acme Corp - January Campaign"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--hyros-blue)]"
          />
          <p className="text-xs text-[var(--hyros-text-gray)] mt-1">
            Internal label for your reference only
          </p>
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-[var(--hyros-text-dark)] mb-2">
            Company Name *
          </label>
          <input
            type="text"
            name="companyName"
            required
            defaultValue={reloadData?.companyName || ''}
            placeholder="Acme Corporation"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--hyros-blue)]"
          />
        </div>

        {/* Business URL (optional, for reference) */}
        <div>
          <label className="block text-sm font-medium text-[var(--hyros-text-dark)] mb-2">
            Business URL (Optional)
          </label>
          <input
            type="url"
            name="businessUrl"
            defaultValue={reloadData?.businessUrl || ''}
            placeholder="https://example.com"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--hyros-blue)]"
          />
          <p className="text-xs text-[var(--hyros-text-gray)] mt-1">
            For reference only - not used for auto-research
          </p>
        </div>

        {/* Company Logo Upload - REQUIRED */}
        <div>
          <label className="block text-sm font-medium text-[var(--hyros-text-dark)] mb-2">
            Company Logo *
          </label>
          {reloadData?.companyLogoUrl && (
            <div className="mb-2 p-2 bg-gray-50 rounded-lg flex items-center gap-3">
              <img
                src={reloadData.companyLogoUrl}
                alt="Current logo"
                className="w-10 h-10 object-contain rounded"
              />
              <span className="text-xs text-[var(--hyros-text-gray)]">
                Current logo shown for reference. Please re-upload.
              </span>
            </div>
          )}
          <input
            type="file"
            name="companyLogo"
            accept="image/*"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--hyros-blue)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
          />
          <p className="text-xs text-[var(--hyros-text-gray)] mt-1">
            Upload the prospect's company logo
          </p>
        </div>

        {/* Business Research MD Upload - REQUIRED */}
        <div>
          <label className="block text-sm font-medium text-[var(--hyros-text-dark)] mb-2">
            Business Research (MD file) *
          </label>
          {reloadData && (
            <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="text-xs text-yellow-700">
                Please re-upload the business research file.
              </span>
            </div>
          )}
          <input
            type="file"
            name="businessResearch"
            accept=".md,.txt"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--hyros-blue)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
          />
          <p className="text-xs text-[var(--hyros-text-gray)] mt-1">
            Upload your research on the business (industry, products, pain points, etc.)
          </p>
        </div>

        {/* Loom Video URL */}
        <div>
          <label className="block text-sm font-medium text-[var(--hyros-text-dark)] mb-2">
            Loom Video URL *
          </label>
          <input
            type="url"
            name="loomVideoUrl"
            required
            defaultValue={reloadData?.loomVideoUrl || ''}
            placeholder="https://www.loom.com/share/..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--hyros-blue)]"
          />
        </div>

        {/* Financial Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--hyros-text-dark)] mb-2">
              Monthly Ad Spend *
            </label>
            <input
              type="number"
              name="adSpend"
              required
              min="0"
              step="1"
              defaultValue={reloadData?.adSpend || ''}
              placeholder="50000"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--hyros-blue)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--hyros-text-dark)] mb-2">
              Monthly Revenue from Ads *
            </label>
            <input
              type="number"
              name="adRevenue"
              required
              min="0"
              step="1"
              defaultValue={reloadData?.adRevenue || ''}
              placeholder="150000"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--hyros-blue)]"
            />
          </div>
        </div>

        {/* Product Links */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--hyros-text-dark)] mb-2">
              Annual Package Link *
            </label>
            <input
              type="url"
              name="primaryProductLink"
              required
              defaultValue={reloadData?.primaryProductLink || ''}
              placeholder="https://checkout.hyros.com/annual"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--hyros-blue)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--hyros-text-dark)] mb-2">
              Annual Price *
            </label>
            <input
              type="number"
              name="primaryProductPrice"
              required
              min="0"
              step="1"
              defaultValue={reloadData?.primaryProductPrice || ''}
              placeholder="9997"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--hyros-blue)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--hyros-text-dark)] mb-2">
              Monthly Package Link *
            </label>
            <input
              type="url"
              name="downsellProductLink"
              required
              defaultValue={reloadData?.downsellProductLink || ''}
              placeholder="https://checkout.hyros.com/monthly"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--hyros-blue)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--hyros-text-dark)] mb-2">
              Monthly Price *
            </label>
            <input
              type="number"
              name="downsellProductPrice"
              required
              min="0"
              step="1"
              defaultValue={reloadData?.downsellProductPrice || ''}
              placeholder="997"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--hyros-blue)]"
            />
          </div>
        </div>

        {errorDetails && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm space-y-2">
            <div className="flex items-start justify-between">
              <span className="font-medium text-red-700">{errorDetails.error}</span>
              {errorDetails.errorCode && (
                <span className="text-xs font-mono bg-red-100 text-red-600 px-2 py-1 rounded">
                  {errorDetails.errorCode}
                </span>
              )}
            </div>
            {errorDetails.details && (
              <div className="text-red-600 text-xs font-mono bg-red-100 p-2 rounded overflow-x-auto">
                {errorDetails.details}
              </div>
            )}
            {errorDetails.timestamp && (
              <div className="text-red-400 text-xs">
                Timestamp: {errorDetails.timestamp}
              </div>
            )}
            <div className="text-red-500 text-xs pt-2 border-t border-red-200">
              Copy this error info and share it for debugging.
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-pill btn-dark touch-target w-full font-medium disabled:opacity-50"
        >
          {loading ? 'Generating Pages...' : 'Generate Pages'}
        </button>
      </form>
    </div>
  );
}
