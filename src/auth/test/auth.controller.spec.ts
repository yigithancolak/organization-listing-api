import { Test } from '@nestjs/testing'
import { AuthController } from 'src/auth/auth.controller'
import { AuthService } from 'src/auth/auth.service'
import { tokenStub } from './stubs/token.stub'

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
        email: 'testaccount@test.com',
        password: 'testaccount'
      }

      const result = await authController.signIn(signInDto)
      console.log(result)
      console.log(tokenStub().accessToken)
      expect(result).toEqual({ accessToken: tokenStub().accessToken })

      expect(authService.signIn).toBeCalledWith(
        signInDto.email,
        signInDto.password
      )
    })
  })
})
