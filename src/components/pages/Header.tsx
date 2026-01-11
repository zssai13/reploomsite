// Dual logo header component
interface HeaderProps {
  hyrosLogoUrl: string;
  brandLogoUrl: string | null;
}

export function Header({ hyrosLogoUrl, brandLogoUrl }: HeaderProps) {
  return (
    <header className="bg-black py-4 px-5 md:py-6 md:px-8">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* HYROS Logo */}
        <div className="flex items-center">
          {hyrosLogoUrl ? (
            <img
              src={hyrosLogoUrl}
              alt="HYROS"
              className="h-8 md:h-10 object-contain"
            />
          ) : (
            <span className="text-white font-semibold text-xl tracking-tight">HYROS</span>
          )}
        </div>

        {/* Brand Logo */}
        {brandLogoUrl && (
          <div className="flex items-center">
            <img
              src={brandLogoUrl}
              alt="Brand"
              className="h-8 md:h-10 object-contain"
            />
          </div>
        )}
      </div>
    </header>
  );
}
