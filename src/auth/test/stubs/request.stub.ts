import { userStub } from 'src/users/test/stubs/user.stub'

export const requestStub = () => {
  return {
    user: {
      sub: userStub()._id
    }
  }
}
