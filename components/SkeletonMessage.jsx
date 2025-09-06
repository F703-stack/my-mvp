export function SkeletonMessage() {
  return (
    <div role="status" aria-live="polite">
      <div className="flex w-full mb-4 justify-start">
        <div className="flex max-w-[80%] gap-3 flex-row">
          <div className="w-8 h-8 flex-shrink-0 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex-shrink-0 bg-gray-100 border border-gray-200 rounded-lg p-3 w-full">
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only">AI is generating a response…</span>
    </div>
  );
}
