'use client';

import EditTestimonial from '@/features/admin-panel/components/EditTestimonial';
import { AuthGuard } from '@/components/AuthGuard';
import { use } from 'react';

interface EditTestimonialPageProps {
  params: Promise<{ id: string }>;
}

const EditTestimonialPage = ({ params }: EditTestimonialPageProps) => {
  const resolvedParams = use(params);

  return (
    <AuthGuard requireAuth={true} requiredRole="admin">
      <EditTestimonial testimonialId={resolvedParams.id} />
    </AuthGuard>
  );
};

export default EditTestimonialPage;
