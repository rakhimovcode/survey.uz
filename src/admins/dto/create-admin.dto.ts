import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator"

export class CreateAdminDto {
    @IsNotEmpty()
    @IsString()
    full_name:string
    @IsEmail()
    @IsNotEmpty()
    email:string
    @IsNotEmpty()
    @IsPhoneNumber("UZ")
    phone_number:string
    @IsNotEmpty()
    @IsString()
    password:string
}
