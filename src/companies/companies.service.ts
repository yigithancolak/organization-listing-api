import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { StorageService } from 'src/storage/storage.service'
import { CreateCompanyDto } from './dto/create-company.dto'
import { GetCompaniesDto } from './dto/get-companies.dto'
import { Company, CompanyDocument } from './schemas/company.schema'

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    private storageService: StorageService
  ) {}

  async create(createCompanyDto: CreateCompanyDto, userId: string) {
    const createCompany = new this.companyModel({
      owner: userId,
      ...createCompanyDto
    })

    try {
      return await createCompany.save()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async find(filters?: GetCompaniesDto) {
    const { category, city, country, page, perPage, workspace } = filters
    const query = {}

    if (category) query['category'] = category
    if (workspace) query['workspace'] = { $in: workspace }
    if (city) query['location.city'] = city
    if (country) query['location.country'] = country

    if (page && perPage) {
      const skip = (page - 1) * perPage
      return await this.companyModel.find(query).skip(skip).limit(perPage)
    }
    return await this.companyModel.find(query)
  }

  async findOneById(id: string): Promise<Company> {
    const foundCompany = await this.companyModel.findOne({ _id: id })

    if (!foundCompany) {
      throw new BadRequestException(`No company found with ID: ${id}`)
    }

    return foundCompany
  }

  async addImagePath(id: string, path: string) {
    const foundCompany = await this.companyModel.findOne({ _id: id })

    if (!foundCompany) {
      throw new NotFoundException()
    }

    if (!foundCompany.files) {
      foundCompany.files = { images: [], pdf: '' } // Initialize with an empty images array (and you can add other properties if needed)
    }

    if (!foundCompany.files.images.includes(path)) {
      foundCompany.files.images.push(path)

      await foundCompany.save()
    }
    return foundCompany
  }

  async updateImagePath(id: string, oldPath: string, newPath: string) {
    const foundCompany = await this.companyModel.findOne({ _id: id })

    if (!foundCompany) {
      throw new NotFoundException()
    }

    foundCompany.files.images = foundCompany.files.images.map((path) => {
      if (path === oldPath) {
        return newPath
      }
      return path
    })

    return await foundCompany.save()
  }

  async removeImage(id: string, path: string) {
    const foundCompany = await this.companyModel.findOne({ _id: id })

    foundCompany.files.images = foundCompany.files.images.filter(
      (url) => !url.includes(path)
    )

    await foundCompany.save()

    return `Image with path ${path} removed from company ${id}`
  }

  async addLogoPath(id: string, path: string) {
    const foundCompany = await this.companyModel.findOne({ _id: id })

    foundCompany.logo = path

    await foundCompany.save()
    return `Logo with path ${path} added to company ${id}`
  }
}
