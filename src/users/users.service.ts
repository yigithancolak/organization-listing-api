import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 8)
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const hashedPassword = await this.hashPassword(createUserDto.password)
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword
    })
    return await createdUser.save()
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find().exec()
  }

  async findOneByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email }).exec()
  }

  async findOneById(id: string): Promise<UserDocument> {
    return await this.userModel.findById(id).exec()
  }

  async update(id: string, updateUserDto: any): Promise<UserDocument> {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password)
    }
    return await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec()
  }

  async delete(id: string): Promise<UserDocument> {
    return await this.userModel.findByIdAndDelete(id).exec()
  }

  async comparePassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(candidatePassword, userPassword)
  }
}
