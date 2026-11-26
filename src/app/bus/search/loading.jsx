// Results skeleton: mirrors search bar, filter rail and bus cards.
function Bone({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-[#e2e8f0] ${className}`} />;
}

export default function Loading() {
  return (
    <div role="status" aria-label="Loading buses" className="min-h-screen bg-[#d5e0e6] pb-16">
      <span className="sr-only">Loading buses…</span>
      <div className="bg-[#05144b] px-3 pt-[31px] pb-12 sm:px-4">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-2 rounded-md bg-[#d5e0e6] p-2 md:grid-cols-3 lg:grid-cols-[1fr_48px_1fr_1fr_188px] lg:px-7">
          <Bone className="h-[51px] bg-white/70" />
          <Bone className="mx-auto hidden size-9 rounded-full bg-white/70 lg:block" />
          <Bone className="h-[51px] bg-white/70" />
          <Bone className="h-[51px] bg-white/70" />
          <Bone className="h-[46px] rounded-full bg-white/70" />
        </div>
      </div>
      <div className="mx-auto -mt-4 grid max-w-[1280px] grid-cols-1 gap-3 px-3 sm:px-4 lg:grid-cols-[295px_minmax(0,1fr)]">
        <div className="hidden flex-col gap-4 rounded-md bg-white p-[17px] lg:flex">
          <Bone className="h-6 w-24" />
          <Bone className="h-14" />
          <Bone className="h-5 w-36" />
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Bone key={i} className="h-12" />
            ))}
          </div>
          <Bone className="h-5 w-28" />
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Bone key={i} className="h-[34px]" />
            ))}
          </div>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Bone key={i} className="h-4" />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <Bone className="h-12 bg-white" />
          <div className="flex flex-col gap-3 rounded-md bg-white p-[17px]">
            <Bone className="h-12" />
            <div className="flex gap-3">
              {[0, 1, 2, 3].map((i) => (
                <Bone key={i} className="h-7 w-28 rounded-full" />
              ))}
            </div>
            <Bone className="h-7 w-64" />
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-1 gap-4 rounded-md bg-white p-6 md:grid-cols-12">
              <div className="flex flex-col gap-2 md:col-span-4">
                <Bone className="h-5 w-24" />
                <Bone className="h-6 w-48" />
                <Bone className="h-3 w-56" />
              </div>
              <Bone className="h-14 md:col-span-5" />
              <div className="flex flex-col items-end gap-2 md:col-span-3">
                <Bone className="h-7 w-20" />
                <Bone className="h-10 w-36 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
