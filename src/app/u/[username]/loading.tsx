import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProfile() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Skeleton className="h-32 w-full rounded-t-xl" />
      
      <div className="relative px-4">
        <div className="absolute -top-16">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>

        <div className="pt-20">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32 mt-2" />
              <Skeleton className="h-4 w-40 mt-2" /> {/* Points and level */}
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          <Skeleton className="h-20 w-full mt-4" />

          <div className="flex gap-4 mt-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="flex gap-6 mt-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}