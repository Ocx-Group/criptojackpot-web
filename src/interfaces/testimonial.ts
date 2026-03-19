export interface Testimonial {
  testimonialGuid: string;
  authorName: string;
  authorLocation: string;
  authorImageUrl?: string;
  text: string;
  rating: number;
  date: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialRequest {
  authorName: string;
  authorLocation: string;
  authorImageUrl?: string;
  text: string;
  rating: number;
  date?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface UpdateTestimonialRequest {
  authorName: string;
  authorLocation: string;
  authorImageUrl?: string;
  text: string;
  rating: number;
  date?: string;
  isActive: boolean;
  sortOrder: number;
}
