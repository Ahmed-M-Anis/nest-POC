import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { SignUpDto } from './dto/signUpDto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { loginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async create(createAuthDto: any) {
    console.log(createAuthDto);
    return await this.usersRepository.save(createAuthDto);
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async validateUserPassword(email: string, password: string): Promise<any> {
    // Retrieve the user by email
    const user = await this.usersRepository.findOne({ where: { email } });

    // Check if user exists and the password is correct
    if (user && (await user.checkPassword(password))) {
      // Extract user properties (without password) to return
      const { password, ...result } = user;
      return result;
    }
  }

  async validateUserExist(email: string) {
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    return existingUser ? true : false;
  }

  async logIn(login: loginDTO): Promise<{ access_token: string }> {
    const user = await this.validateUserPassword(login.email, login.password);
    if (!user) throw new UnauthorizedException('Wrong email or password');
    if (!user.isActive)
      throw new HttpException('User is blocked', HttpStatus.FORBIDDEN);

    const payload = { id: user.id, firstName: user.firstName, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signUpDto: SignUpDto) {
    try {
      const isExist: boolean = await this.validateUserExist(signUpDto.email);

      if (isExist) {
        throw new HttpException(
          'This email is already registered.',
          HttpStatus.FORBIDDEN,
        );
      }
      const user = this.usersRepository.create(signUpDto);
      console.log(user);
      this.usersRepository.insert(user);
      const payload = {
        id: user.id,
        firstName: user.firstName,
        role: user.role,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
  }
}
