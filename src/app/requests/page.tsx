import { MainLayout } from '@/components/layout';
import { RequestsList } from './requests-list';

export default function RequestsPage() {
  return (
    <MainLayout>
      <RequestsList />
    </MainLayout>
  );
}
