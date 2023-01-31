import { IsNotEmpty } from 'class-validator';

export class UpdateDeedDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
