import { IsString } from 'class-validator';

export class ResendOtpDto {
  @IsString()
  challengeToken!: string;
}
