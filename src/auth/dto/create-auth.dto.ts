import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    @IsEmail({}, { message: 'Email is invalid' })
    @IsNotEmpty({ message: 'Email should not empty' })
    email: string;

    @IsNotEmpty({ message: 'Password should not empty' })
    password: string;

    @IsNotEmpty({ message: 'Name should not empty' })
    name: string;
}

export class CodeAuthDto {
    @IsNotEmpty({ message: 'id should not empty' })
    _id: string;

    @IsNotEmpty({ message: 'Code should not empty' })
    code: string;
}
