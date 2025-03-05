import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString({ message: 'First Name must be a string' })
  readonly firstName: string;

  @IsNotEmpty()
  @IsString({ message: 'Last Name must be a string' })
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be valid' })
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  readonly password: string;
}
