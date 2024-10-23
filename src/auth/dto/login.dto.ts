import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class loginDTO {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be valid' })
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  readonly password: string;
}
