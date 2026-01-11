// Loom video embed component with 16:9 aspect ratio
interface VideoEmbedProps {
  url: string;
}

export function VideoEmbed({ url }: VideoEmbedProps) {
  // Convert Loom share URL to embed URL
  const getEmbedUrl = (shareUrl: string): string => {
    // Handle various Loom URL formats
    const loomMatch = shareUrl.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
    if (loomMatch) {
      return `https://www.loom.com/embed/${loomMatch[1]}`;
    }
    // If already an embed URL or other format, return as-is
    return shareUrl;
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <div className="w-full max-w-3xl mx-auto px-5 md:px-8">
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
        style={{ paddingBottom: '56.25%' }} // 16:9 aspect ratio
      >
        <iframe
          src={embedUrl}
          frameBorder="0"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
          allow="autoplay; fullscreen"
        />
      </div>
    </div>
  );
}
