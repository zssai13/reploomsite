'use client';

interface DeletePageButtonProps {
  pageName: string;
}

export function DeletePageButton({ pageName }: DeletePageButtonProps) {
  function handleClick(e: React.MouseEvent) {
    if (!confirm(`Delete "${pageName}"?`)) {
      e.preventDefault();
    }
  }

  return (
    <button
      type="submit"
      onClick={handleClick}
      className="text-xs px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
    >
      Delete
    </button>
  );
}
