import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUpDto';
import { loginDTO } from './dto/login.dto';
import { ApiResponse } from 'src/common/utility/response/ApiResponse';
import { PaginatedResponse } from 'src/common/utility/response/PaginatedResponse';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto ';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //only for testing
  /*  @UseGuards(AuthGuard, RolesGuard)
  @Role('user') 
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
  } */

  @Post('login')
  async logIn(@Body() loginDTO: loginDTO) {
    const user = await this.authService.logIn(loginDTO);
    return ApiResponse.success('success', user);
  }

  @Post('signup')
  async signUp(@Body() SignUpDto: SignUpDto) {
    const user = await this.authService.signUp(SignUpDto);
    return ApiResponse.success('success', user);
  }
}
