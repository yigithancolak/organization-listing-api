import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'
import { Company, CompanyDocument } from 'src/companies/schemas/company.schema'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>
  ) {}

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

  async update(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<UserDocument> {
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

  async deleteUserWithCompanies(userId: string) {
    const userToDelete = await this.findOneById(userId)

    if (!userToDelete) {
      throw new NotFoundException('user not found')
    }

    const session = await this.userModel.startSession()
    session.startTransaction()

    try {
      //deleting the companies that user has and the user
      await this.companyModel.deleteMany({ owner: userId }).session(session)
      await this.userModel.findByIdAndDelete(userId).session(session)

      // If everything looks good, commit the changes.
      await session.commitTransaction()
    } catch (error) {
      // If something goes wrong, abort the transaction and roll back.
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }

    return userToDelete
  }
}
