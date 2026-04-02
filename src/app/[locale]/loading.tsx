import { Spinner } from '@/shared/ui/primitives/spinner';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Spinner className="size-8" />
    </div>
  );
}
