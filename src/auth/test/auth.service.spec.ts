import { Test } from '@nestjs/testing'
import { userStub } from 'src/users/test/stubs/user.stub'
import { AuthService } from '../auth.service'
import { accessTokenStub, tokenStub } from './stubs/token.stub'

jest.mock('../auth.service')

describe('The AuthenticationService', () => {
  let authService: AuthService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService]
    }).compile()

    authService = module.get<AuthService>(AuthService)
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  describe('signIn', () => {
    it('should sign in the user', async () => {
      const result = await authService.signIn(
        userStub().email,
        userStub().password
      )

      expect(result).toEqual({ accessToken: tokenStub().accessToken })
    })
  })

  describe('signUp', () => {
    it('should sign up a new user', async () => {
      const result = await authService.signUp({
        email: userStub().email,
        password: userStub().password,
        fullname: userStub().fullname
      })

      expect(result).toEqual(userStub())
    })
  })

  describe('getProfile', () => {
    it('should return access token', async () => {
      const user = userStub()
      const result = await authService.getTokens(user._id, user.email)

      expect(result).toEqual(accessTokenStub())
    })
  })

  describe('deleteUser', () => {
    it('should return deleted user', async () => {
      const result = await authService.deleteUser(userStub()._id)

      expect(result).toEqual(userStub())
    })
  })
})
