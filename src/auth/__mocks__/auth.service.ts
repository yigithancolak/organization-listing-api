import { userStub } from 'src/users/test/stubs/user.stub'
import { tokenStub } from '../test/stubs/token.stub'

export const AuthService = jest.fn().mockReturnValue({
  signIn: jest.fn().mockResolvedValue({ accessToken: tokenStub().accessToken }),
  signUp: jest.fn().mockResolvedValue(userStub()),
  getTokens: jest
    .fn()
    .mockResolvedValue({ accessToken: tokenStub().accessToken }),
  deleteUser: jest.fn().mockResolvedValue(userStub())
})
