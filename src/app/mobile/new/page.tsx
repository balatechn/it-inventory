import { MainLayout } from '@/components/layout/main-layout';
import { MobileForm } from './mobile-form';

export default function NewMobilePage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Mobile / SIM</h1>
          <p className="text-sm text-gray-600">Register a new mobile device or SIM card</p>
        </div>
        <MobileForm />
      </div>
    </MainLayout>
  );
}
