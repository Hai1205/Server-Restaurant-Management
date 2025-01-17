import { Allow, IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name should not empty' })
  name: string;
  
  @IsEmail({}, {message: 'Email is invalid'})
  @IsNotEmpty({ message: 'Email should not empty' })
  email: string;

  @IsString({ message: 'Password should be string' })
  @MinLength(6, {message: 'Password should be atleast 6 charactor'})
  password: string;

  // @IsNotEmpty({ message: 'Phone should not empty' })
  @Matches(/^((\+84|0)[3|5|7|8|9])+([0-9]{8})$/, { 
    message: 'Phone number is invalid' 
  })
  phone: string;

  @Allow()
  address: string;

  @Allow()
  image: string;
}



