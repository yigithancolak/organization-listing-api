import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'
import { getLogLevels } from './util/getLogLevels'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production')
  })
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    origin: '*'
  })
  app.use(cookieParser())
  await app.listen(8888)
}
bootstrap()
