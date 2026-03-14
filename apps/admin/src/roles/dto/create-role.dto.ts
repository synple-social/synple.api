import { IsNotEmpty } from "class-validator"

export class CreateRoleDto {
  @IsNotEmpty({ message: 'required' })
  name: string
  isDefault: boolean
}