import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CatsModule } from './cats/cats.module'
import { CompaniesModule } from './companies/companies.module'
import { LogsMiddleware } from './logs.middleware'
import { StorageModule } from './storage/storage.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.NODE_ENV === 'production'
        ? process.env.MONGO_DB_URI
        : 'mongodb://localhost:27017/listing'
    ),
    CatsModule,
    AuthModule,
    CompaniesModule,
    StorageModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*')
  }
}
