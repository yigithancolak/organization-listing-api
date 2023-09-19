import { UserDocument, UserStatus } from 'src/users/schemas/user.schema'

export const userStub = (): Partial<UserDocument> => {
  return {
    _id: '64f1e516955dd265234f47ba', //random uuid
    email: 'testaccount1@test.com',
    fullname: 'testaccount',
    password: 'testaccount1',
    status: UserStatus.Pending
  }
}
