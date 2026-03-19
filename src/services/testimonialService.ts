import { PaginationRequest } from '@/interfaces/pagination';
import { BaseService } from './baseService';
import { Testimonial, CreateTestimonialRequest, UpdateTestimonialRequest } from '@/interfaces/testimonial';
import { PaginatedResponse } from '@/interfaces/paginatedResponse';

class TestimonialService extends BaseService {
  protected endpoint = 'testimonials';

  constructor() {
    super('/api/v1');
  }

  async createTestimonial(request: CreateTestimonialRequest): Promise<Testimonial> {
    return this.create<CreateTestimonialRequest, Testimonial>(request);
  }

  async getAllTestimonials(pagination?: PaginationRequest): Promise<PaginatedResponse<Testimonial>> {
    const params: Record<string, string> = {};
    if (pagination?.pageNumber) params.pageNumber = pagination.pageNumber.toString();
    if (pagination?.pageSize) params.pageSize = pagination.pageSize.toString();

    return this.getAllPaginated<Testimonial>({ params });
  }

  async getActiveTestimonials(): Promise<Testimonial[]> {
    return this.getAll<Testimonial>({ path: 'active' });
  }

  async getTestimonialById(id: string): Promise<Testimonial> {
    return this.getById<Testimonial>(id);
  }

  async updateTestimonial(id: string, request: UpdateTestimonialRequest): Promise<Testimonial> {
    return this.update<UpdateTestimonialRequest, Testimonial>(id, request);
  }

  async deleteTestimonial(id: string): Promise<void> {
    return this.delete(id);
  }
}

export { TestimonialService };
