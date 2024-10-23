import { PartialType } from '@nestjs/mapped-types';
import { SignUpDto } from './signUpDto';

export class UpdateAuthDto extends PartialType(SignUpDto) {}
