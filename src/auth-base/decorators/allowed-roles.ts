import { SetMetadata } from '@nestjs/common'

export function AllowedRoles<TRole extends string = string>(...roles : TRole[]) {
    return SetMetadata('allowed-roles', roles)
}