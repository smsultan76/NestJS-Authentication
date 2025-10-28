import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePaypentDto{
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsNumber()
    amount:number;
    
    @IsString()
    @IsOptional()
    location: string;
}