import { Type } from 'class-transformer'
import {
  IsArray,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested
} from 'class-validator'
import { Day } from '../schemas/company.schema'

class ContactsDto {
  @IsOptional()
  @IsString()
  readonly fullname?: string

  @IsOptional()
  @IsEmail()
  readonly email?: string
}

class SocialLinksDto {
  @IsOptional()
  @IsString()
  readonly twitter?: string

  @IsOptional()
  @IsString()
  readonly facebook?: string

  @IsOptional()
  @IsString()
  readonly linkedin?: string
}

class WorkingHoursDto {
  @IsDefined()
  @IsEnum(Day)
  readonly day: Day

  @IsDefined()
  @IsString()
  // Regex validation for hours might be added here
  readonly hours: string
}

class FilesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly images?: string[]

  @IsOptional()
  @IsString()
  readonly pdf?: string
}

class CoordinatesDto {
  @IsDefined()
  @IsNumber()
  readonly lat: number

  @IsDefined()
  @IsNumber()
  readonly long: number
}

class LocationDto {
  @IsDefined()
  @IsString()
  readonly country: string

  @IsDefined()
  @IsString()
  readonly city: string
}

export class CreateCompanyDto {
  @IsDefined()
  @IsString()
  readonly name: string

  @IsDefined()
  @IsString()
  readonly description: string

  @IsDefined()
  @IsEmail()
  readonly email: string

  @IsDefined()
  @IsString()
  readonly company_phone: string

  @IsOptional()
  @IsString()
  readonly logo?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => FilesDto)
  readonly files?: FilesDto

  @IsDefined()
  @IsString()
  readonly category: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly workspace?: string[]

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactsDto)
  readonly contacts?: ContactsDto

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  readonly social_links?: SocialLinksDto

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkingHoursDto)
  readonly working_hours?: WorkingHoursDto[]

  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  readonly coordinates?: CoordinatesDto

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  readonly location?: LocationDto

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly tags?: string[]

  @IsOptional()
  @IsString()
  @IsUrl()
  readonly website?: string
}
