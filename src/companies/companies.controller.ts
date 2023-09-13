import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Delete,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { StorageService } from 'src/storage/storage.service'
import { CompaniesService } from './companies.service'
import { CreateCompanyDto } from './dto/create-company.dto'
import { GetCompaniesDto } from './dto/get-companies.dto'

@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly storageService: StorageService
  ) {}

  @Post('/search')
  async getCompanies(@Body() body: GetCompaniesDto) {
    if (!body) {
      return await this.companiesService.find()
    }

    return await this.companiesService.find(body)
  }

  @Post()
  async createCompany(@Body() createCompanyDto: CreateCompanyDto, @Req() req) {
    const userId = req.user.sub as string

    return await this.companiesService.create(createCompanyDto, userId)
  }

  //IMAGE FILES
  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 })
          // new FileTypeValidator({ fileType: 'image/jpeg' })
        ]
      })
    )
    file: Express.Multer.File,
    @Param('id') id: string
  ) {
    const fileType = file.mimetype.includes('pdf') ? 'pdf' : 'images'

    try {
      const cloudDestination = `${id}/${fileType}/${file.originalname}` //folder: id, file name: original file name

      await this.storageService.save(
        cloudDestination,
        file.mimetype,
        file.buffer,
        [{ mediaId: file.originalname }]
      )
      await this.companiesService.addImagePath(id, cloudDestination)
      return { message: 'File uploaded successfully' }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  async changeImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 })
          // new FileTypeValidator({ fileType: 'image/jpeg' })
        ]
      })
    )
    file: Express.Multer.File,
    @Param('id') id: string,
    @Body('path') path: string
  ) {
    const fileType = file.mimetype.includes('pdf') ? 'pdf' : 'images'

    try {
      const cloudDestination = `${id}/${fileType}/${file.originalname}` //folder: id, file name: original file name
      // console.log(cloudDestination)

      await this.storageService.save(
        cloudDestination,
        file.mimetype,
        file.buffer,
        [{ mediaId: file.originalname }]
      )

      await this.storageService.delete(path)

      await this.companiesService.updateImagePath(id, path, cloudDestination)
      return { message: 'File uploaded successfully' }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  @Delete(':id/image')
  async deleteFile(@Param('id') id: string, @Body('fileName') path: string) {
    try {
      await this.storageService.delete(path) //delete from cloud storage
      await this.companiesService.removeImage(id, path) //delete from database

      return { message: 'File deleted successfully.' }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  //LOGO
  @Post(':id/logo')
  @UseInterceptors(FileInterceptor('file'))
  async addLogo(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 })
          // new FileTypeValidator({ fileType: 'image/jpeg' })
        ]
      })
    )
    file: Express.Multer.File
  ) {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed')
    }

    try {
      const cloudDestination = `${id}/logo/${file.originalname}` //folder: id/logo, file name: original file name
      // console.log(cloudDestination)

      await this.storageService.save(
        cloudDestination,
        file.mimetype,
        file.buffer,
        [{ mediaId: file.originalname }]
      )

      await this.companiesService.addLogoPath(id, cloudDestination)
      return { message: 'File uploaded successfully' }
    } catch (error) {
      // console.log('error: ', error)

      throw new BadGatewayException(error.message)
    }
  }

  @Patch(':id/logo')
  @UseInterceptors(FileInterceptor('file'))
  async updateLogo(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 })
          // new FileTypeValidator({ fileType: 'image/jpeg' })
        ]
      })
    )
    file: Express.Multer.File,
    @Body('path') path: string
  ) {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed')
    }

    try {
      const cloudDestination = `${id}/logo/${file.originalname}` //folder: id/logo, file name: original file name

      await this.storageService.save(
        cloudDestination,
        file.mimetype,
        file.buffer,
        [{ mediaId: file.originalname }]
      )

      await this.storageService.delete(path)

      await this.companiesService.addLogoPath(id, cloudDestination)
      return { message: 'File uploaded successfully' }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  // @Get()
  // findAll() {
  //   return this.companiesService.findAll()
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.companiesService.findOne(+id)
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
  //   return this.companiesService.update(+id, updateCompanyDto)
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.companiesService.remove(+id)
  // }
}
