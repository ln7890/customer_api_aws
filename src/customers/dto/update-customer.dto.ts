import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { IsEmail, IsOptional } from 'class-validator';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @IsOptional()
  id?: any;

  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
