import { Type } from 'class-transformer'
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested
} from 'class-validator'
import { CompanyStatus, Day } from '../schemas/company.schema'

class ContactsDto {
  @IsOptional()
  @IsString()
  readonly tel?: string

  @IsOptional()
  @IsEmail()
  readonly email?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly social_links?: string[]

  @IsOptional()
  @IsUrl()
  readonly website?: string
}

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string

  @IsString()
  @IsNotEmpty()
  readonly description: string

  @IsEmail()
  readonly email: string

  @IsOptional()
  @IsEnum(CompanyStatus)
  readonly status?: CompanyStatus

  @IsNotEmpty()
  readonly owner: string

  @IsOptional()
  @IsString()
  readonly logo?: string

  @IsOptional()
  readonly files?: {
    pictures?: string[]
    pdf?: string
  }

  @IsOptional()
  @IsString()
  readonly workspace?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactsDto)
  readonly contacts?: ContactsDto

  @IsOptional()
  @IsArray()
  readonly working_hours?: {
    day: Day
    hours: string
  }[]

  @IsOptional()
  readonly coordinates?: {
    lat: number
    long: number
  }

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly tags?: string[]
}
