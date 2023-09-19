import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

export enum UserStatus {
  Pending = 'pending',
  Confirmed = 'confirmed'
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  fullname: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ default: UserStatus.Pending, enum: UserStatus })
  status: UserStatus

  // @Prop()
  // refreshToken: string[]
}

export const UserSchema = SchemaFactory.createForClass(User)
