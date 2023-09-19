import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email)
    if (
      !user ||
      !(await this.usersService.comparePassword(password, user.password))
    ) {
      throw new BadRequestException('Invalid credentials')
    }
    // const payload = { email: user.email, sub: user._id }

    const { accessToken } = await this.getTokens(user._id, user.email)

    return {
      accessToken
    }
  }

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.usersService.findOneByEmail(createUserDto.email)

    if (user) {
      throw new BadRequestException('email already in use')
    }

    try {
      const newUser = await this.usersService.create(createUserDto)
      return newUser
    } catch (error) {
      throw new InternalServerErrorException(
        'an error occurred while creating the user'
      )
    }
  }

  async getTokens(userId: string, email: string) {
    const [
      accessToken
      // refreshToken
    ] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email
        },
        {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: 60 * 60 * 24 * 7
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email
        },
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: 60 * 60 * 24 * 7
        }
      )
    ])

    return {
      accessToken
      // refreshToken
    }
  }

  async deleteUser(id: string) {
    const deletedUser = await this.usersService.deleteUserWithCompanies(id)

    return deletedUser
  }
}
