import { IsEnum, IsPhoneNumber, MinLength } from "class-validator"
import { UserRole } from "src/common/enums/user-role.enum"

export class RegisterDto {
    @IsPhoneNumber('KH')
    phone !: string

    @MinLength(6,{message:'Password must be at least 6 characters long'})
    password!: string

    @IsEnum([UserRole.STUDENT,UserRole.EMPLOYER])
    role!: UserRole
}