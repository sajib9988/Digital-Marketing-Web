import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { verifyTurnstileToken } from '../common/utils/turnstile.util';
import type { ContactStatus } from '../../generated/prisma/enums';
import type { CreateContactDto } from './dto/create-contact.dto';
import type { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(status?: ContactStatus) {
    return this.prisma.contact.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact ${id} not found`);
    }
    return contact;
  }

  async create(dto: CreateContactDto, remoteIp?: string) {
    const { turnstileToken, ...data } = dto;

    const verified = await verifyTurnstileToken(turnstileToken, remoteIp);
    if (!verified) {
      throw new BadRequestException('Verification failed — please try again');
    }

    return this.prisma.contact.create({ data });
  }

  async update(id: string, dto: UpdateContactDto) {
    await this.findOne(id);
    return this.prisma.contact.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.contact.delete({ where: { id } });
    return { success: true };
  }
}
