// Simple footer component
export function Footer() {
  return (
    <footer className="py-8 md:py-12 px-5 md:px-8 bg-black">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-[var(--hyros-text-muted)] text-sm">
          © {new Date().getFullYear()} HYROS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
