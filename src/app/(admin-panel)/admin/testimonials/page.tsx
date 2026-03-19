'use client';

import TestimonialsList from '@/features/admin-panel/components/TestimonialsList';
import { AuthGuard } from '@/components/AuthGuard';

const TestimonialsPage = () => {
  return (
    <AuthGuard requireAuth={true} requiredRole="admin">
      <TestimonialsList />
    </AuthGuard>
  );
};

export default TestimonialsPage;
