import Link from 'next/link';
import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[var(--hyros-off-white)]">
      {/* Top Navigation */}
      <nav className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link href="/admin" className="font-semibold text-xl tracking-tight">
                HYROS
              </Link>

              {/* Nav Links */}
              <div className="flex gap-1">
                <Link
                  href="/admin/create"
                  className="px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors"
                >
                  Create
                </Link>
                <Link
                  href="/admin/pages"
                  className="px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors"
                >
                  Pages
                </Link>
                <Link
                  href="/admin/settings"
                  className="px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors"
                >
                  Settings
                </Link>
              </div>
            </div>

            {/* User / Logout */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--hyros-text-muted)]">
                {session.user?.name}
              </span>
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/login' });
                }}
              >
                <button
                  type="submit"
                  className="text-sm text-[var(--hyros-text-muted)] hover:text-white transition-colors"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
