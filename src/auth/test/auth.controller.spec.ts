import { Test } from '@nestjs/testing'
import { AuthController } from 'src/auth/auth.controller'
import { AuthService } from 'src/auth/auth.service'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { User } from 'src/users/schemas/user.schema'
import { userStub } from 'src/users/test/stubs/user.stub'
import { requestStub } from './stubs/request.stub'
import { accessTokenStub, tokenStub } from './stubs/token.stub'

jest.mock('../auth.service')

describe('AuthController', () => {
  let authController: AuthController
  let authService: AuthService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [AuthService]
    }).compile()

    authController = moduleRef.get<AuthController>(AuthController)
    authService = moduleRef.get<AuthService>(AuthService)
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(authController).toBeDefined()
    expect(authService).toBeDefined()
  })

  describe('signIn', () => {
    it('should return a token when valid credentials are provided', async () => {
      const signInDto = {
        email: userStub().email,
        password: userStub().password
      }

      const result = await authController.signIn(signInDto)

      expect(result).toEqual({ accessToken: tokenStub().accessToken })

      expect(authService.signIn).toBeCalledWith(
        signInDto.email,
        signInDto.password
      )
    })
  })

  describe('signUp', () => {
    it('should return user', async () => {
      const createUserDto: CreateUserDto = {
        email: userStub().email,
        fullname: userStub().fullname,
        password: userStub().password
      }

      const result: User = await authController.signUp(createUserDto)

      expect(authService.signUp).toBeCalledWith(createUserDto)
      expect(result).toEqual(userStub())
    })
  })

  describe('deleteProfile', () => {
    it('should return deleted user', async () => {
      const result: User = await authController.deleteProfile(requestStub())

      expect(authService.deleteUser).toBeCalledWith(requestStub().user.sub)
      expect(result).toEqual(userStub())
    })
  })

  describe('getProfile', () => {
    it('should return token object', () => {
      const result = authController.getProfile(requestStub())

      expect(result).toEqual({ sub: accessTokenStub().sub })
    })
  })
})
