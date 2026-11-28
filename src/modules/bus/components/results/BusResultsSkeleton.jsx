export function Bone({ className = "" }) {
  return (
    <div
      className={`rounded-md bg-[#e2e8f0] motion-safe:animate-pulse ${className}`}
    />
  );
}

export function BusFiltersSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="hidden flex-col gap-4 rounded-md bg-white p-[17px] lg:flex"
    >
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
  );
}

export function BusResultsSkeleton() {
  return (
    <>
      <span role="status" className="sr-only">
        Searching for buses?
      </span>
      <div aria-hidden="true" className="flex flex-col gap-3">
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
          <div
            key={i}
            className="grid grid-cols-1 gap-4 rounded-md bg-white p-6 md:grid-cols-12"
          >
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
    </>
  );
}
