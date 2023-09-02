import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength
} from 'class-validator'

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  fullname: string

  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @IsOptional()
  password: string
}
