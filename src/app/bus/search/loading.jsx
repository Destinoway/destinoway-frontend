import { Bone, BusFiltersSkeleton, BusResultsSkeleton } from "@/modules/bus/components/results/BusResultsSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#d5e0e6] pb-16">
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
        <BusFiltersSkeleton />
        <div className="flex flex-col gap-3">
          <Bone className="h-12 bg-white" />
          <BusResultsSkeleton />
        </div>
      </div>
    </div>
  );
}
