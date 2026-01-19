import { MainLayout } from '@/components/layout/main-layout';
import { SoftwareForm } from './software-form';

export default function NewSoftwarePage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Software</h1>
          <p className="text-sm text-gray-600">Register a new software license or subscription</p>
        </div>
        <SoftwareForm />
      </div>
    </MainLayout>
  );
}
