import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { StorageModule } from 'src/storage/storage.module'
import { StorageService } from 'src/storage/storage.service'
import { CompaniesController } from './companies.controller'
import { CompaniesService } from './companies.service'
import { Company, CompanySchema } from './schemas/company.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    StorageModule,
    ThrottlerModule.forRoot({
      ttl: 60, //in 60 seconds
      limit: 3 // max 3 request can be accepted
    })
  ],
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    StorageService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class CompaniesModule {}
