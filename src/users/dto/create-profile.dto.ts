import {
  IsAlpha,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @Length(3, 20)
  @IsAlpha(undefined, {
    message: 'El primer nombre debe contener solo letras',
  })
  firstname: string;

  @IsString()
  @Length(3, 20)
  @IsAlpha(undefined, {
    message: 'El primer nombre debe contener solo letras',
  })
  lastname: string;

  @IsOptional()
  @IsNumber()
  age?: number;
}
