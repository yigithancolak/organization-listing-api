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
}

export const UserSchema = SchemaFactory.createForClass(User)

// // Password hashing middleware
// UserSchema.pre('save', async function (next) {
//   const user = this
//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password, 8)
//   }
//   next()
// })

// UserSchema.methods.comparePassword = async function (
//   candidatePassword: string
// ): Promise<boolean> {
//   const user = this
//   return bcrypt.compare(candidatePassword, user.password)
// }
