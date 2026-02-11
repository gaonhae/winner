export default function Loading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-foreground/10 p-4 animate-pulse"
        >
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-foreground/10 rounded w-3/4" />
              <div className="h-4 bg-foreground/5 rounded w-full" />
              <div className="h-3 bg-foreground/5 rounded w-1/3 mt-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
