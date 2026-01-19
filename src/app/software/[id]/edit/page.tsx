'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SoftwareForm } from '../../new/software-form';
import { LoadingSpinner } from '@/components/ui/loading';
import { SoftwareInput } from '@/lib/validations';

export default function EditSoftwarePage() {
  const params = useParams();
  const id = params.id as string;
  const [software, setSoftware] = useState<(SoftwareInput & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSoftware() {
      try {
        const response = await fetch(`/api/software/${id}`);
        if (!response.ok) {
          throw new Error('Software not found');
        }
        const data = await response.json();
        setSoftware(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load software');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchSoftware();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !software) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-red-500">{error || 'Software not found'}</p>
        <a href="/software" className="text-[#070B47] hover:underline">
          Back to Software
        </a>
      </div>
    );
  }

  return <SoftwareForm initialData={software} />;
}
