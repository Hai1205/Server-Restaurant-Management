import { Allow, IsEmail, IsMongoId, IsNotEmpty, Matches } from 'class-validator';

export class UpdateUserDto {
    @IsNotEmpty({ message: 'Name should not empty' })
    name: string;

    @Allow()
    address: string;

    @Allow()
    image: string;
}
