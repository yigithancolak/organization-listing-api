import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { StorageService } from 'src/storage/storage.service'
import { CreateCompanyDto } from './dto/create-company.dto'
import { Company, CompanyDocument } from './schemas/company.schema'

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    private storageService: StorageService
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const createCompany = new this.companyModel({
      ...createCompanyDto
    })

    try {
      return await createCompany.save()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  findAll() {
    return `This action returns all companies`
  }

  async findOneById(id: string): Promise<Company> {
    const foundCompany = await this.companyModel.findOne({ _id: id })

    if (!foundCompany) {
      throw new BadRequestException(`No company found with ID: ${id}`)
    }

    return foundCompany
  }

  async updateCompanyImages(id: string, path: string) {
    const foundCompany = await this.companyModel.findOne({ _id: id })

    if (!foundCompany) {
      throw new BadRequestException('No id found for update company images')
    }

    if (!foundCompany.files.images.includes(path)) {
      foundCompany.files.images.push(path)

      await foundCompany.save()
    }
    return foundCompany
  }

  async removeImage(id: string, path: string) {
    const foundCompany = await this.companyModel.findOne({ _id: id })

    foundCompany.files.images = foundCompany.files.images.filter(
      (url) => !url.includes(path)
    )

    await foundCompany.save()

    return `Image with path ${path} removed from company ${id}`
  }
}
