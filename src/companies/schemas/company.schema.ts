import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { User } from 'src/users/schemas/user.schema'

export type CompanyDocument = Company & Document

export enum CompanyStatus {
  Pending = 'pending',
  Confirmed = 'confirmed'
}

export enum Day {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday'
}

Schema({ _id: false })
class WorkingHours {
  @Prop({ type: String, enum: Day })
  day: Day

  @Prop({ match: /(\d{2}:\d{2}-\d{2}:\d{2})/ })
  hours: string
}

@Schema({ _id: false })
class Files {
  @Prop([String])
  images: string[]

  @Prop()
  pdf: string
}

@Schema({ _id: false })
class Coordinates {
  @Prop()
  lat: number

  @Prop()
  long: number
}

@Schema({ _id: false })
class Location {
  @Prop()
  country: string

  @Prop()
  city: string
}

@Schema({ _id: false })
class Contacts {
  @Prop()
  tel: string

  @Prop()
  email: string

  @Prop([String])
  social_links: string[]

  @Prop()
  website: string
}

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ default: CompanyStatus.Pending, enum: CompanyStatus })
  status: CompanyStatus

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: User | Types.ObjectId

  @Prop()
  logo: string

  @Prop({ type: Files })
  files: Files

  @Prop()
  category: string

  @Prop([String])
  workspace: string[]

  @Prop({ type: Contacts })
  contacts: Contacts

  @Prop([WorkingHours])
  working_hours: WorkingHours[]

  @Prop({ type: Coordinates })
  coordinates: Coordinates

  @Prop({ type: Location })
  location: Location

  @Prop([String])
  tags: string[]
}

export const CompanySchema = SchemaFactory.createForClass(Company)
