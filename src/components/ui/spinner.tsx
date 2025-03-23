export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={`h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin ${className}`}
    />
  );
}