// loading.tsx is a special Next.js file built on top of React Suspense.
// It allows you to create fallback UI to show as a replacement while page content loads.
// To make sure it only applied to dashboard, needs to be in (overview) Route Group

import DashboardSkeleton from '@/app/ui/skeletons';

export default function Loading() {
  return <DashboardSkeleton/>
}