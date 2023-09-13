import { IsArray, IsOptional, IsPositive, IsString } from 'class-validator'

export class GetCompaniesDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsPositive()
  page?: number

  @IsOptional()
  @IsPositive()
  perPage?: number

  @IsOptional()
  @IsString()
  country?: string

  @IsOptional()
  @IsString()
  city?: string

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  workspace?: string[]
}
