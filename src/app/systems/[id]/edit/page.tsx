'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SystemForm } from '../../system-form';
import { LoadingSpinner } from '@/components/ui/loading';
import { SystemInput } from '@/lib/validations';

export default function EditSystemPage() {
  const params = useParams();
  const id = params.id as string;
  const [system, setSystem] = useState<(SystemInput & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSystem() {
      try {
        const response = await fetch(`/api/systems/${id}`);
        if (!response.ok) {
          throw new Error('System not found');
        }
        const data = await response.json();
        setSystem(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load system');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchSystem();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !system) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-red-500">{error || 'System not found'}</p>
        <a href="/systems" className="text-[#070B47] hover:underline">
          Back to Systems
        </a>
      </div>
    );
  }

  return <SystemForm initialData={system} isEditing />;
}
