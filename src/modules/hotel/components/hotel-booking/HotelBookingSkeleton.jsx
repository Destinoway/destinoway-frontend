const SkeletonBlock = ({ className = "" }) => (
  <div className={`animate-pulse rounded bg-slate-200 ${className}`} />
);

function SkeletonCard({ children, className = "" }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export default function HotelBookingSkeleton() {
  return (
    <main
      aria-label="Loading hotel booking details"
      aria-busy="true"
      className="min-h-screen w-full overflow-x-hidden bg-[#edf2f5]"
    >
      <div className="box-background-color min-h-[150px] w-full">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <SkeletonBlock className="h-7 w-24 bg-white/30" />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1250px] gap-4 px-2 pb-8 sm:px-4 lg:grid-cols-[minmax(0,15fr)_minmax(300px,8fr)] lg:gap-5">
        <section className="-mt-10 space-y-4">
          <SkeletonCard>
            <SkeletonBlock className="mb-3 h-7 w-44" />
            <SkeletonBlock className="mb-6 h-4 w-72 max-w-full" />
            {[0, 1].map((room) => (
              <div key={room} className="mb-5 rounded-lg border border-slate-100 p-4 last:mb-0">
                <SkeletonBlock className="mb-4 h-5 w-28" />
                <div className="grid gap-4 sm:grid-cols-3">
                  {[0, 1, 2].map((field) => <SkeletonBlock key={field} className="h-12 w-full" />)}
                </div>
              </div>
            ))}
            <div className="grid gap-4 sm:grid-cols-2">
              {[0, 1, 2, 3].map((field) => <SkeletonBlock key={field} className="h-12 w-full" />)}
            </div>
          </SkeletonCard>

          <SkeletonCard>
            <SkeletonBlock className="mb-4 h-6 w-40" />
            <SkeletonBlock className="mb-3 h-4 w-full" />
            <SkeletonBlock className="h-24 w-full" />
          </SkeletonCard>
          <SkeletonCard>
            <SkeletonBlock className="mb-4 h-6 w-48" />
            <SkeletonBlock className="h-20 w-full" />
          </SkeletonCard>
          <SkeletonBlock className="h-12 w-56 max-w-full" />
        </section>

        <aside className="-mt-10 space-y-4">
          <SkeletonCard>
            <SkeletonBlock className="mb-4 h-40 w-full" />
            <SkeletonBlock className="mb-3 h-6 w-3/4" />
            <SkeletonBlock className="mb-2 h-4 w-full" />
            <SkeletonBlock className="h-4 w-2/3" />
          </SkeletonCard>
          <SkeletonCard>
            <SkeletonBlock className="mb-4 h-5 w-36" />
            <SkeletonBlock className="mb-3 h-16 w-full" />
            <SkeletonBlock className="h-4 w-2/3" />
          </SkeletonCard>
          <SkeletonCard>
            <SkeletonBlock className="mb-4 h-5 w-32" />
            <SkeletonBlock className="mb-3 h-5 w-full" />
            <SkeletonBlock className="mb-3 h-16 w-full" />
            <SkeletonBlock className="h-4 w-3/4" />
          </SkeletonCard>
        </aside>
      </div>
    </main>
  );
}
