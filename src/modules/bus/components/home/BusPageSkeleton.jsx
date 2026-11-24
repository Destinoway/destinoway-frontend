// Skeleton for /bus: mirrors the real page layout so content doesn't jump
// when it arrives. Pure markup (no client JS) so it paints immediately.

function Bone({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-[#e9edf3] ${className}`} />;
}

function Container({ children, className = "" }) {
  return <div className={`mx-auto w-full max-w-[1233px] px-4 ${className}`}>{children}</div>;
}

function SectionHeader({ wide = false }) {
  return (
    <div className="flex flex-col gap-2">
      <Bone className="h-3 w-32" />
      <Bone className={`h-8 ${wide ? "w-80 max-w-full" : "w-64 max-w-full"}`} />
      <Bone className="h-4 w-[28rem] max-w-full" />
    </div>
  );
}

export default function BusPageSkeleton() {
  return (
    <div role="status" aria-label="Loading bus page" className="pb-16">
      <span className="sr-only">Loading…</span>

      {/* Hero banner */}
      <div className="h-[220px] w-full animate-pulse bg-[#e2e8f0] sm:h-[280px] lg:h-[339px]" />

      {/* Search card */}
      <div className="relative z-10 mx-auto -mt-16 w-full max-w-[1232px] px-4 sm:-mt-20 lg:-mt-[92px]">
        <div className="relative rounded-xl bg-white px-4 pt-12 pb-4 shadow-[0_8px_15px_rgba(0,0,0,0.08)] sm:px-6 sm:pt-[52px]">
          <div className="absolute -top-8 left-1/2 flex -translate-x-1/2 gap-6 sm:-top-12 sm:gap-[50px]">
            {[0, 1, 2].map((i) => (
              <div key={i} className="size-16 rounded-[10px] bg-white p-2 shadow-[4px_4px_20px_rgba(0,0,0,0.08)] sm:size-[90px]">
                <Bone className="size-full rounded-lg" />
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Bone className="h-5 w-32" />
            <Bone className="h-5 w-24" />
            <Bone className="h-5 w-28" />
          </div>

          <div className="grid grid-cols-1 items-center gap-3 py-[13px] lg:grid-cols-[minmax(0,1fr)_36px_minmax(0,1fr)_261px_190px]">
            <Bone className="h-[65px] rounded-xl" />
            <Bone className="mx-auto size-9 rounded-full" />
            <Bone className="h-[65px] rounded-xl" />
            <Bone className="h-[65px] rounded-xl" />
            <Bone className="h-[60px] rounded-xl" />
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-[#f1f5f9] pt-4">
            <Bone className="h-4 w-28" />
            {[0, 1, 2, 3].map((i) => (
              <Bone key={i} className="h-6 w-24 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <Container className="mt-5">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-[#eef1f5] shadow-[0_8px_15px_rgba(0,0,0,0.08)] sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3 bg-white px-3.5 py-6">
              <Bone className="size-6 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Bone className="h-3.5 w-3/4" />
                <Bone className="h-3 w-full" />
                <Bone className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Offers */}
      <Container className="mt-6">
        <div className="rounded-[14px] bg-[rgba(226,145,16,0.12)] px-4 py-[18px]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2">
              <Bone className="h-7 w-48 bg-white/70" />
              <Bone className="h-4 w-80 max-w-full bg-white/70" />
            </div>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <Bone key={i} className="h-8 w-20 rounded-full bg-white/70" />
              ))}
            </div>
          </div>
          <div className="mt-6 flex gap-4 overflow-hidden">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex h-[198px] w-[260px] shrink-0 flex-col justify-between rounded-2xl bg-white p-[17px] md:flex-1">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <Bone className="h-5 w-16" />
                    <Bone className="h-3 w-20" />
                  </div>
                  <Bone className="h-5 w-4/5" />
                  <Bone className="h-3 w-full" />
                  <Bone className="h-3 w-2/3" />
                </div>
                <Bone className="h-7 w-28 rounded" />
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Trending destinations */}
      <Container className="mt-8">
        <SectionHeader wide />
        <div className="mt-6 flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Bone key={i} className="h-8 w-28 shrink-0 rounded-full" />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-3xl border border-[#f1f5f9] bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] ${
                i === 2 ? "hidden lg:block" : i === 1 ? "hidden md:block" : ""
              }`}
            >
              <Bone className="h-[256px] rounded-none" />
              <div className="flex flex-col gap-2 p-6">
                <div className="flex justify-between">
                  <Bone className="h-3 w-24" />
                  <Bone className="h-3 w-28" />
                </div>
                <Bone className="h-6 w-3/4" />
                <Bone className="h-3 w-full" />
                <Bone className="h-3 w-5/6" />
                <div className="mt-3 flex justify-between border-t border-[#f1f5f9] pt-4">
                  <Bone className="h-3 w-28" />
                  <Bone className="h-3 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* What's new */}
      <Container className="mt-10">
        <SectionHeader />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Bone key={i} className="h-[190px] rounded-2xl" />
          ))}
        </div>
      </Container>

      {/* Cabin classes */}
      <Container className="mt-12">
        <SectionHeader />
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-[25px]">
              <Bone className="size-12 rounded-xl" />
              <Bone className="h-5 w-1/2" />
              <Bone className="h-3 w-2/3" />
              {[0, 1, 2, 3].map((j) => (
                <Bone key={j} className="h-3 w-4/5" />
              ))}
              <div className="mt-3 flex justify-between border-t border-[#f1f5f9] pt-4">
                <Bone className="h-3 w-20" />
                <Bone className="h-5 w-24" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
