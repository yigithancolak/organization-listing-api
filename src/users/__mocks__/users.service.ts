import { NotFoundException } from '@nestjs/common'
import { userStub } from '../test/stubs/user.stub'

export const UsersService = jest.fn().mockReturnValue({
  hashPassword: jest.fn().mockResolvedValue(userStub().password),
  create: jest.fn().mockResolvedValue(userStub()),
  findAll: jest.fn().mockResolvedValue([userStub()]),
  findOneByEmail: jest.fn().mockResolvedValue(userStub()),
  findOneById: jest.fn().mockResolvedValue(userStub()),
  update: jest.fn().mockResolvedValue(userStub()),
  delete: jest.fn().mockResolvedValue(userStub()),
  comparePassword: jest.fn().mockResolvedValue(true),
  deleteUserWithCompanies: jest.fn().mockImplementation((userId) => {
    if (userId === userStub()._id) {
      return Promise.resolve(userStub())
    } else {
      throw new NotFoundException('user not found')
    }
  })
})
