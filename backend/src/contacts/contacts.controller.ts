import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { ContactStatus } from '../../generated/prisma/enums';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactsService } from './contacts.service';

const CONTACT_STATUS_VALUES = Object.values(ContactStatus);

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  // Public contact form submission — no auth, but rate-limited against spam.
  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(201)
  @Post()
  create(@Body() dto: CreateContactDto, @Req() req: Request) {
    return this.contactsService.create(dto, req.ip);
  }

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get()
  findAll(@Query('status') status?: string) {
    if (status && !CONTACT_STATUS_VALUES.includes(status as ContactStatus)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }
    return this.contactsService.findAll(status as ContactStatus | undefined);
  }

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContactDto) {
    return this.contactsService.update(id, dto);
  }

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }
}
