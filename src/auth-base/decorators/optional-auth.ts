import { SetMetadata } from '@nestjs/common'

export function OptionalAuth() {
    return SetMetadata('token-required', false)
}