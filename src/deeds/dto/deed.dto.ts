import { IsNotEmpty } from 'class-validator';

export class DeedDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  rate: string;
}
