import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    @IsEmail({}, {message: 'Email is invalid'})
    @IsNotEmpty({ message: 'Email should not empty' })
    email: string;

    @IsNotEmpty({ message: 'Password should not empty' })
    password: string;
}
