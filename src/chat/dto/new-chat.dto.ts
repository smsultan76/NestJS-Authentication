import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class NewChatDto {
    @IsOptional()
    @IsUUID()
    chat_id?: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsNotEmpty()
    @IsString()
    content: string;
    
}