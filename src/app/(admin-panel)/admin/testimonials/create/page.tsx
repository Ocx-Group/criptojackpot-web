'use client';

import CreateTestimonial from '@/features/admin-panel/components/CreateTestimonial';
import { AuthGuard } from '@/components/AuthGuard';

const CreateTestimonialPage = () => {
  return (
    <AuthGuard requireAuth={true} requiredRole="admin">
      <CreateTestimonial />
    </AuthGuard>
  );
};

export default CreateTestimonialPage;
