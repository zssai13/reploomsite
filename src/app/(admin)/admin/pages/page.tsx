import Link from 'next/link';
import { getAllPages, deletePage } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { DeletePageButton } from '@/components/admin/DeletePageButton';

export const dynamic = 'force-dynamic';

export default async function PagesListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; created?: string }>;
}) {
  const params = await searchParams;
  const allPages = await getAllPages();

  // Filter by search if provided
  const search = params.search?.toLowerCase() || '';
  const pages = search
    ? allPages.filter(
        (p) =>
          p.referenceName.toLowerCase().includes(search) ||
          p.companyName.toLowerCase().includes(search) ||
          (p.businessUrl?.toLowerCase().includes(search) ?? false)
      )
    : allPages;

  async function handleDelete(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await deletePage(id);
    revalidatePath('/admin/pages');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[var(--hyros-text-dark)]">
          Generated Pages
        </h1>
        <Link
          href="/admin/create"
          className="btn-pill btn-dark px-6 py-2 text-sm"
        >
          + Create New
        </Link>
      </div>

      {params.created && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
          Page created successfully! Slug: {params.created}
        </div>
      )}

      {/* Search */}
      <form className="mb-6">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search by name, company, or URL..."
          className="w-full max-w-md px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--hyros-blue)]"
        />
      </form>

      {/* Pages List */}
      {pages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl">
          <p className="text-[var(--hyros-text-gray)]">
            {search ? 'No pages match your search.' : 'No pages created yet.'}
          </p>
          {!search && (
            <Link
              href="/admin/create"
              className="inline-block mt-4 text-[var(--hyros-blue)] font-medium"
            >
              Create your first page →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {pages.map((page) => (
            <div
              key={page.id}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-[var(--hyros-text-dark)]">
                      {page.referenceName}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        page.status === 'ready'
                          ? 'bg-green-100 text-green-700'
                          : page.status === 'generating'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {page.status}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--hyros-text-gray)] mt-1">
                    {page.companyName}{page.businessUrl && ` • ${page.businessUrl}`}
                  </p>
                  <p className="text-xs text-[var(--hyros-text-muted)] mt-1">
                    Created {new Date(page.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {page.status === 'ready' && (
                    <>
                      <Link
                        href={`/p/${page.slug}/pitch`}
                        target="_blank"
                        className="text-xs px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        Pitch
                      </Link>
                      <Link
                        href={`/p/${page.slug}/close-1`}
                        target="_blank"
                        className="text-xs px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        Close 1
                      </Link>
                      <Link
                        href={`/p/${page.slug}/close-2`}
                        target="_blank"
                        className="text-xs px-3 py-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        Close 2
                      </Link>
                    </>
                  )}
                  <Link
                    href={`/admin/create?reload=${encodeURIComponent(JSON.stringify({
                      referenceName: page.referenceName,
                      companyName: page.companyName,
                      businessUrl: page.businessUrl || '',
                      loomVideoUrl: page.loomVideoUrl,
                      adSpend: page.adSpend,
                      adRevenue: page.adRevenue,
                      primaryProductLink: page.primaryProductLink,
                      primaryProductPrice: page.primaryProductPrice,
                      downsellProductLink: page.downsellProductLink,
                      downsellProductPrice: page.downsellProductPrice,
                      companyLogoUrl: page.companyLogoUrl || '',
                    }))}`}
                    className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    Reload
                  </Link>
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={page.id} />
                    <DeletePageButton pageName={page.referenceName} />
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
