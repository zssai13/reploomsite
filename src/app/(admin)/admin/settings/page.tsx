'use client';

import { useState, useEffect, useRef } from 'react';
import type { Settings, Testimonial, TestimonialEntry } from '@/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialBank, setTestimonialBank] = useState<TestimonialEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingTestimonials, setUploadingTestimonials] = useState(false);
  const [message, setMessage] = useState('');

  // Logo change modal state
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialEntry | null>(null);
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [newLogoPreview, setNewLogoPreview] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [settingsRes, testimonialsRes, testimonialBankRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/testimonials'),
        fetch('/api/testimonial-bank'),
      ]);
      const settingsData = await settingsRes.json();
      const testimonialsData = await testimonialsRes.json();
      const testimonialBankData = await testimonialBankRes.json();

      if (settingsData.success) setSettings(settingsData.data);
      if (testimonialsData.success) setTestimonials(testimonialsData.data);
      if (testimonialBankData.success) setTestimonialBank(testimonialBankData.data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSavePrompt(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const prompt = formData.get('systemPrompt') as string;

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generationSystemPrompt: prompt }),
      });
      const data = await res.json();

      if (data.success) {
        setSettings(data.data);
        setMessage('System prompt saved!');
      }
    } catch {
      setMessage('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'logos');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        // Update settings with new logo URL
        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hyrosLogoUrl: data.data.url }),
        });
        loadData();
        setMessage('Logo uploaded!');
      }
    } catch {
      setMessage('Upload failed');
    }
  }

  async function handleRagUpload(e: React.ChangeEvent<HTMLInputElement>, docType: string) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'rag');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        // Update settings with new RAG document URL
        const ragUpdate = {
          ragDocuments: {
            ...settings?.ragDocuments,
            [docType]: data.data.url,
          },
        };
        await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ragUpdate),
        });
        loadData();
        setMessage(`${docType} uploaded!`);
      }
    } catch {
      setMessage('Upload failed');
    }
  }

  async function handleRagRemove(docType: string) {
    if (!confirm('Remove this RAG document?')) return;

    try {
      const ragUpdate = {
        ragDocuments: {
          ...settings?.ragDocuments,
          [docType]: null,
        },
      };
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ragUpdate),
      });
      const data = await res.json();

      if (data.success) {
        loadData();
        setMessage(`${docType} removed!`);
      }
    } catch {
      setMessage('Failed to remove');
    }
  }

  async function handleTestimonialBankUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTestimonials(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/testimonial-bank', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setTestimonialBank(data.data.testimonials);
        setMessage(`Loaded ${data.data.count} testimonials (${data.data.logosFound} logos found)`);
      } else {
        setMessage(data.error || 'Failed to process testimonials');
      }
    } catch {
      setMessage('Failed to upload testimonials');
    } finally {
      setUploadingTestimonials(false);
    }
  }

  async function handleTestimonialBankClear() {
    if (!confirm('Clear all testimonials from the bank?')) return;

    try {
      const res = await fetch('/api/testimonial-bank', {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setTestimonialBank([]);
        setMessage('Testimonial bank cleared');
      }
    } catch {
      setMessage('Failed to clear testimonial bank');
    }
  }

  // Open logo change modal
  function openLogoModal(testimonial: TestimonialEntry) {
    setSelectedTestimonial(testimonial);
    setNewLogoFile(null);
    setNewLogoPreview(null);
    setLogoModalOpen(true);
  }

  // Close logo change modal
  function closeLogoModal() {
    setLogoModalOpen(false);
    setSelectedTestimonial(null);
    setNewLogoFile(null);
    setNewLogoPreview(null);
  }

  // Handle logo file selection
  function handleLogoFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate it's an image
    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file');
      return;
    }

    setNewLogoFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  // Save new logo for testimonial
  async function handleSaveNewLogo() {
    if (!newLogoFile || !selectedTestimonial) return;

    setUploadingLogo(true);

    try {
      // First upload the file
      const formData = new FormData();
      formData.append('file', newLogoFile);
      formData.append('type', 'testimonial-logos');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        setMessage('Failed to upload logo');
        setUploadingLogo(false);
        return;
      }

      // Then update the testimonial with the new logo URL
      const updateRes = await fetch('/api/testimonial-bank', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTestimonial.id,
          updates: { logoUrl: uploadData.data.url },
        }),
      });
      const updateData = await updateRes.json();

      if (updateData.success) {
        // Update local state
        setTestimonialBank(prev =>
          prev.map(t =>
            t.id === selectedTestimonial.id
              ? { ...t, logoUrl: uploadData.data.url }
              : t
          )
        );
        setMessage(`Logo updated for ${selectedTestimonial.companyName}`);
        closeLogoModal();
      } else {
        setMessage('Failed to update testimonial logo');
      }
    } catch {
      setMessage('Failed to save new logo');
    } finally {
      setUploadingLogo(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--hyros-text-gray)]">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-[var(--hyros-text-dark)] mb-6">
        Settings
      </h1>

      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
          {message}
        </div>
      )}

      {/* HYROS Logo */}
      <section className="bg-white rounded-2xl p-6 mb-6">
        <h2 className="font-medium text-[var(--hyros-text-dark)] mb-4">HYROS Logo</h2>
        <div className="flex items-center gap-4">
          {settings?.hyrosLogoUrl && (
            <img
              src={settings.hyrosLogoUrl}
              alt="HYROS Logo"
              className="h-12 object-contain bg-black p-2 rounded"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
          />
        </div>
      </section>

      {/* System Prompt */}
      <section className="bg-white rounded-2xl p-6 mb-6">
        <h2 className="font-medium text-[var(--hyros-text-dark)] mb-4">System Prompt</h2>
        <form onSubmit={handleSavePrompt}>
          <textarea
            name="systemPrompt"
            rows={8}
            defaultValue={settings?.generationSystemPrompt}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--hyros-blue)] resize-none font-mono text-sm"
          />
          <button
            type="submit"
            disabled={saving}
            className="mt-4 btn-pill btn-dark px-6 py-2 text-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Prompt'}
          </button>
        </form>
      </section>

      {/* RAG Documents */}
      <section className="bg-white rounded-2xl p-6 mb-6">
        <h2 className="font-medium text-[var(--hyros-text-dark)] mb-4">RAG Documents</h2>
        <p className="text-sm text-[var(--hyros-text-gray)] mb-4">
          Upload knowledge base documents to provide context for AI-generated content.
        </p>

        <div className="space-y-4">
          <div className="p-4 border border-gray-100 rounded-xl">
            <label className="block text-sm font-medium text-[var(--hyros-text-dark)] mb-2">
              Sales Knowledge Base
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              {settings?.ragDocuments?.salesKnowledgeBase ? (
                <>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Uploaded
                  </span>
                  <button
                    onClick={() => handleRagRemove('salesKnowledgeBase')}
                    className="text-sm text-red-600 hover:text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <span className="text-[var(--hyros-text-muted)] text-sm">Not uploaded</span>
              )}
              <input
                type="file"
                accept=".md,.txt"
                onChange={(e) => handleRagUpload(e, 'salesKnowledgeBase')}
                className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
            </div>
          </div>

          <div className="p-4 border border-gray-100 rounded-xl">
            <label className="block text-sm font-medium text-[var(--hyros-text-dark)] mb-2">
              Business Intel Dossier
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              {settings?.ragDocuments?.businessIntelDossier ? (
                <>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Uploaded
                  </span>
                  <button
                    onClick={() => handleRagRemove('businessIntelDossier')}
                    className="text-sm text-red-600 hover:text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <span className="text-[var(--hyros-text-muted)] text-sm">Not uploaded</span>
              )}
              <input
                type="file"
                accept=".md,.txt"
                onChange={(e) => handleRagUpload(e, 'businessIntelDossier')}
                className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
            </div>
          </div>

          <div className="p-4 border border-gray-100 rounded-xl">
            <label className="block text-sm font-medium text-[var(--hyros-text-dark)] mb-2">
              Sales Transcripts
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              {settings?.ragDocuments?.salesTranscripts ? (
                <>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Uploaded
                  </span>
                  <button
                    onClick={() => handleRagRemove('salesTranscripts')}
                    className="text-sm text-red-600 hover:text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <span className="text-[var(--hyros-text-muted)] text-sm">Not uploaded</span>
              )}
              <input
                type="file"
                accept=".md,.txt"
                onChange={(e) => handleRagUpload(e, 'salesTranscripts')}
                className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Bank */}
      <section className="bg-white rounded-2xl p-6">
        <h2 className="font-medium text-[var(--hyros-text-dark)] mb-4">
          Testimonial Bank
        </h2>
        <p className="text-sm text-[var(--hyros-text-gray)] mb-4">
          Upload your testimonials markdown file. The system will parse testimonials and fetch company logos from Clearbit.
        </p>

        {/* Upload area */}
        <div className="p-4 border border-gray-100 rounded-xl mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="file"
              accept=".md,.txt"
              onChange={handleTestimonialBankUpload}
              disabled={uploadingTestimonials}
              className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50"
            />
            {uploadingTestimonials && (
              <span className="text-sm text-[var(--hyros-text-gray)]">Processing...</span>
            )}
            {testimonialBank.length > 0 && (
              <button
                onClick={handleTestimonialBankClear}
                className="text-sm text-red-600 hover:text-red-700 hover:underline"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Status */}
        {testimonialBank.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {testimonialBank.length} testimonials loaded
              </span>
              <span className="text-[var(--hyros-text-gray)]">
                {testimonialBank.filter(t => t.logoUrl).length} logos found
              </span>
            </div>
          </div>
        )}

        {/* Preview list - Shows ALL testimonials */}
        {testimonialBank.length > 0 && (
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {testimonialBank.map((t, i) => (
                <div
                  key={t.id}
                  className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-gray-100' : ''}`}
                >
                  {/* Logo or initial */}
                  <div className="relative w-10 h-10 flex-shrink-0">
                    {t.logoUrl ? (
                      <>
                        <img
                          src={t.logoUrl}
                          alt={t.companyName}
                          className="w-10 h-10 rounded-lg object-contain bg-gray-50 border border-gray-100"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling;
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                        <div className="w-10 h-10 rounded-lg bg-gray-100 hidden flex items-center justify-center text-sm font-medium text-gray-500 absolute inset-0">
                          {t.companyName.charAt(0)}
                        </div>
                      </>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-500">
                        {t.companyName.charAt(0)}
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--hyros-text-dark)] truncate">
                      {t.companyName}
                    </p>
                    <p className="text-xs text-[var(--hyros-text-gray)] truncate">
                      {t.industry} • {t.benefitFocus}
                    </p>
                  </div>
                  {/* Stat */}
                  {t.stat && (
                    <span className="text-sm font-semibold text-blue-600 flex-shrink-0">
                      {t.stat}
                    </span>
                  )}
                  {/* Change Logo Button */}
                  <button
                    onClick={() => openLogoModal(t)}
                    className="flex-shrink-0 text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                  >
                    Change Logo
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {testimonialBank.length === 0 && (
          <div className="text-center py-8 text-[var(--hyros-text-gray)]">
            <p className="text-sm">No testimonials loaded yet.</p>
            <p className="text-xs mt-1">Upload a markdown file to get started.</p>
          </div>
        )}
      </section>

      {/* Logo Change Modal */}
      {logoModalOpen && selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--hyros-text-dark)]">
                Change Logo
              </h3>
              <button
                onClick={closeLogoModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-[var(--hyros-text-gray)] mb-4">
              Upload a new logo for <span className="font-medium text-[var(--hyros-text-dark)]">{selectedTestimonial.companyName}</span>
            </p>

            {/* Current Logo Preview */}
            <div className="mb-4">
              <p className="text-xs text-[var(--hyros-text-muted)] mb-2">Current Logo:</p>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                {selectedTestimonial.logoUrl ? (
                  <img
                    src={selectedTestimonial.logoUrl}
                    alt={selectedTestimonial.companyName}
                    className="w-12 h-12 rounded-lg object-contain bg-white border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-lg font-medium text-gray-500">
                    {selectedTestimonial.companyName.charAt(0)}
                  </div>
                )}
                <span className="text-sm text-[var(--hyros-text-gray)]">
                  {selectedTestimonial.logoUrl ? 'Logo set' : 'No logo'}
                </span>
              </div>
            </div>

            {/* New Logo Upload */}
            <div className="mb-6">
              <p className="text-xs text-[var(--hyros-text-muted)] mb-2">New Logo (square recommended):</p>
              <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-gray-300 transition-colors cursor-pointer">
                {newLogoPreview ? (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={newLogoPreview}
                      alt="New logo preview"
                      className="w-16 h-16 rounded-lg object-contain bg-gray-50 border border-gray-200"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewLogoFile(null);
                        setNewLogoPreview(null);
                        if (logoInputRef.current) logoInputRef.current.value = '';
                      }}
                      className="text-xs text-red-600 hover:text-red-700 relative z-10"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-[var(--hyros-text-gray)]">Click to upload image</p>
                    <p className="text-xs text-[var(--hyros-text-muted)] mt-1">PNG, JPG, or SVG</p>
                  </div>
                )}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeLogoModal}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-[var(--hyros-text-gray)] rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewLogo}
                disabled={!newLogoFile || uploadingLogo}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingLogo ? 'Saving...' : 'Save Logo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
