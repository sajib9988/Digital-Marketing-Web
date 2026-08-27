import { IsEnum } from 'class-validator';
import { ContactStatus } from '../../../generated/prisma/enums';

export class UpdateContactDto {
  @IsEnum(ContactStatus)
  status!: ContactStatus;
}
