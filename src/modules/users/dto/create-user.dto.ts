import { Allow, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name should not empty' })
  name: string;
  
  @IsEmail({}, {message: 'Email is invalid'})
  @IsNotEmpty({ message: 'Email should not empty' })
  email: string;

  @IsString({ message: 'Password should be string' })
  @MinLength(6, {message: 'Password should be atleast 6 charactor'})
  password: string;

  @IsNotEmpty({ message: 'Phone should not empty' })
  phone: string;

  @Allow()
  address: string;

  @Allow()
  image: string;
}
