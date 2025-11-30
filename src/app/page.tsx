import { Suspense } from 'react';
import HomePageClient from './HomePageClient';
import { Loader2 } from 'lucide-react';

export default function Page() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    }>
      <HomePageClient />
    </Suspense>
  );
}
