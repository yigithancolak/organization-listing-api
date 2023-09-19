import { userStub } from '../test/stubs/user.stub'

export const UsersService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(userStub()),
  findAll: jest.fn().mockResolvedValue([userStub()]),
  findOneByEmail: jest.fn().mockResolvedValue(userStub()),
  findOneById: jest.fn().mockResolvedValue(userStub()),
  update: jest.fn().mockResolvedValue(userStub())
})
