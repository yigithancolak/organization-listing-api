import { userStub } from 'src/users/test/stubs/user.stub'
import { accessTokenStub, tokenStub } from '../test/stubs/token.stub'

export const AuthService = jest.fn().mockReturnValue({
  signIn: jest.fn().mockResolvedValue({ accessToken: tokenStub().accessToken }),
  signUp: jest.fn().mockResolvedValue(userStub()),
  getProfile: jest.fn().mockResolvedValue(accessTokenStub()),
  deleteUser: jest.fn().mockResolvedValue(userStub())
})
