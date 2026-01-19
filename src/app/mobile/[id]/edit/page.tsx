'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MobileForm } from '../../new/mobile-form';
import { LoadingSpinner } from '@/components/ui/loading';
import { MobileInput } from '@/lib/validations';

export default function EditMobilePage() {
  const params = useParams();
  const id = params.id as string;
  const [mobile, setMobile] = useState<(MobileInput & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMobile() {
      try {
        const response = await fetch(`/api/mobile/${id}`);
        if (!response.ok) {
          throw new Error('Mobile not found');
        }
        const data = await response.json();
        setMobile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load mobile');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchMobile();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !mobile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-red-500">{error || 'Mobile not found'}</p>
        <a href="/mobile" className="text-[#070B47] hover:underline">
          Back to Mobile
        </a>
      </div>
    );
  }

  return <MobileForm initialData={mobile} />;
}
