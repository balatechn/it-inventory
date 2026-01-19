'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { RequestForm } from '../../request-form';
import { LoadingSpinner } from '@/components/ui/loading';
import { RequestInput } from '@/lib/validations';

export default function EditRequestPage() {
  const params = useParams();
  const id = params.id as string;
  const [request, setRequest] = useState<(RequestInput & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRequest() {
      try {
        const response = await fetch(`/api/requests/${id}`);
        if (!response.ok) {
          throw new Error('Request not found');
        }
        const data = await response.json();
        setRequest(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load request');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchRequest();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-red-500">{error || 'Request not found'}</p>
        <a href="/requests" className="text-[#070B47] hover:underline">
          Back to Requests
        </a>
      </div>
    );
  }

  return <RequestForm initialData={request} isEditing />;
}
