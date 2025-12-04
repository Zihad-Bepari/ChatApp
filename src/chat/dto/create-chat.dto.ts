import { IsOptional, IsString } from "class-validator";
import { MessageType } from "generated/prisma/enums";
export class CreateChatDto {

    @IsString()
    @IsOptional()
    text: string | null;

    @IsString()
    @IsOptional()
    imageUrl: string | null;
    
    @IsOptional()
    @IsString()
    audioUrl: string | null;

    @IsString()
    user: string;
    
    
    type: MessageType;
}
