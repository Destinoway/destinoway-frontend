function Bone({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-[#e2e8f0] ${className}`} />;
}

export default function BookingSkeleton() {
  return (
    <div role="status" aria-label="Loading booking" className="relative min-h-screen bg-[#d5e0e6] pb-16">
      <span className="sr-only">Loading booking…</span>
      <div aria-hidden className="absolute inset-x-0 top-0 h-[146px] bg-[#05144b]" />
      <div className="relative mx-auto max-w-[1283px] px-3 sm:px-4">
        <div className="flex justify-between pt-8 pb-6">
          <Bone className="h-4 w-40 bg-white/30" />
          <Bone className="h-4 w-36 rounded-full bg-white/30" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_401px]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-xl bg-white p-6">
              <Bone className="h-5 w-40" />
              <div className="flex justify-between">
                <Bone className="h-14 w-60" />
                <Bone className="h-10 w-40" />
              </div>
            </div>
            <Bone className="h-[72px] rounded-xl bg-white" />
            <div className="flex flex-col gap-4 rounded-xl bg-white p-6">
              <Bone className="h-6 w-48" />
              <Bone className="h-32 rounded-xl" />
              <Bone className="h-32 rounded-xl" />
            </div>
            <Bone className="h-[160px] rounded-xl bg-white" />
          </div>
          <div className="hidden flex-col gap-6 lg:flex">
            <Bone className="h-[320px] rounded-xl bg-white" />
            <Bone className="h-[360px] rounded-xl bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
