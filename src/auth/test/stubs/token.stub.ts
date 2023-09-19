import { userStub } from 'src/users/test/stubs/user.stub'

export const tokenStub = () => {
  return {
    accessToken: 'mockAccessToken',
    refreshToken: 'mockRefreshToken'
  }
}

export const accessTokenStub = () => {
  return {
    sub: userStub()._id,
    email: userStub().email,
    iat: 1694950154,
    exp: 1695554954
  }
}
