import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateTestimonialDto } from './dto/create-testimonial.dto';
import type { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const testimonial = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      throw new NotFoundException(`Testimonial ${id} not found`);
    }
    return testimonial;
  }

  async create(dto: CreateTestimonialDto) {
    return this.withFriendlyClientError(() =>
      this.prisma.testimonial.create({ data: dto }),
    );
  }

  async update(id: string, dto: UpdateTestimonialDto) {
    await this.findOne(id);
    return this.withFriendlyClientError(() =>
      this.prisma.testimonial.update({ where: { id }, data: dto }),
    );
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.testimonial.delete({ where: { id } });
    return { success: true };
  }

  private async withFriendlyClientError<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException('The specified client does not exist');
      }
      throw error;
    }
  }
}
