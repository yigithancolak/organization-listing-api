import { User, UserStatus } from 'src/users/schemas/user.schema'

export const userStub = (): User => {
  return {
    email: 'testaccount1@test.com',
    fullname: 'testaccount',
    password: 'testaccount1',
    status: UserStatus.Pending
  }
}
