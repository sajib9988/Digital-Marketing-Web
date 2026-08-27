import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

// Submitted by the public site's contact form — unauthenticated by design.
export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  subject?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message!: string;

  // Cloudflare Turnstile token from the widget on the public contact form.
  @IsString()
  @IsNotEmpty()
  turnstileToken!: string;
}
