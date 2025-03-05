import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUpDto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from './guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/auth/decorator/role.decorator';
import { loginDTO } from './dto/login.dto';
import { ResponseService } from 'src/common/utility/response/response.service';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseService: ResponseService,
  ) {}

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

  @UseGuards(AuthGuard, RolesGuard)
  @Role('user')
  @Get()
  async findAll() {
    const users = await this.authService.findAll();
    return this.responseService.success(users);
  }

  @Post('login')
  async logIn(@Body() loginDTO: loginDTO) {
    const user = await this.authService.logIn(loginDTO);
    return this.responseService.success(user);
  }

  @Post('signup')
  async signUp(@Body() SignUpDto: SignUpDto) {
    const user = await this.authService.signUp(SignUpDto);
    return this.responseService.success(user);
  }
}
