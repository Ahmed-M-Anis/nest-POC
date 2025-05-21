import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUpDto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from './guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorator/role.decorator';
import { loginDTO } from './dto/login.dto';
import { ApiResponse } from 'src/common/utility/response/ApiResponse';
import { PaginatedResponse } from 'src/common/utility/response/PaginatedResponse';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto ';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*   @Post()
  async create(@Body() SignUpDto: SignUpDto) {
    return await this.authService.create(SignUpDto);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  } */

  /*   @UseGuards(AuthGuard, RolesGuard)
  @Role('user') */
  @Get()
  async findAll() {
    const users = await this.authService.findAll();

    const userResponse = plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });

    return ApiResponse.success('User found', userResponse);
  }

  @Get('paginated')
  async getAllUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
    const [users, total] = await this.authService.paginateUsers(+page, +limit);

    const userResponse = plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });

    const paginated = new PaginatedResponse(userResponse, +page, +limit, total);

    return ApiResponse.success(
      'Users fetched successfully',
      paginated.items,
      paginated.getMeta(),
    );
  }

  @Post('login')
  async logIn(@Body() loginDTO: loginDTO) {
    const user = await this.authService.logIn(loginDTO);
    return user;
  }

  @Post('signup')
  async signUp(@Body() SignUpDto: SignUpDto) {
    const user = await this.authService.signUp(SignUpDto);
    return user;
  }
}
