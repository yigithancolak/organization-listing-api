import {
  Body,
  Controller,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { StorageService } from 'src/storage/storage.service'
import { CompaniesService } from './companies.service'
import { CreateCompanyDto } from './dto/create-company.dto'

@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly storageService: StorageService
  ) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto)
  }

  @Post(':id/uploadImage')
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
    console.log(file)

    const fileType = file.mimetype.includes('pdf') ? 'pdf' : 'images'

    try {
      const cloudDestination = `${id}/${fileType}/${file.originalname}` //folder: id, file name: original file name

      await this.storageService.save(
        cloudDestination,
        file.mimetype,
        file.buffer,
        [{ mediaId: file.originalname }]
      )
      await this.companiesService.updateCompanyImages(id, cloudDestination)
      return { message: 'File uploaded successfully' }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  @Post(':id/deleteImage')
  async deleteFile(@Param('id') id: string, @Body('fileName') path: string) {
    try {
      await this.storageService.delete(path) //delete from cloud storage
      await this.companiesService.removeImage(id, path) //delete from database

      return { message: 'File deleted successfully.' }
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
