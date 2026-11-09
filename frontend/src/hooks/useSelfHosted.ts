'use client';

import { useSubscription } from './useUpdates';

export function useIsSelfHosted(): boolean {
  if (typeof window !== 'undefined' && (window as any).__ZENOTA_SELF_HOSTED__ !== undefined) {
    return Boolean((window as any).__ZENOTA_SELF_HOSTED__);
  }
  const { data: stats } = useSubscription();
  if (stats?.isSelfHosted !== undefined) {
    return stats.isSelfHosted;
  }
  return process.env.NEXT_PUBLIC_SELF_HOSTED !== 'false';
}
