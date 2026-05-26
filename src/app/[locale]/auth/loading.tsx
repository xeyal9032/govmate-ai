import { Skeleton } from '@/components/ui/skeleton';

export default function AuthLoading() {
  return (
    <div className="flex items-center justify-center">
      <Skeleton className="h-96 w-full max-w-md rounded-xl" />
    </div>
  );
}
