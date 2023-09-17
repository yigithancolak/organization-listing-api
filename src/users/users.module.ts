import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Company, CompanySchema } from 'src/companies/schemas/company.schema'
import { User, UserSchema } from './schemas/user.schema'
import { UsersService } from './users.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Company.name, schema: CompanySchema }
    ])
  ],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
