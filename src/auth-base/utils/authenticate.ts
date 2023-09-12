import { JwtService } from '@nestjs/jwt'
import { SecuredEndpointRequest } from '../types/secured-endpoint-request'
import { AuthBaseAccount } from '../types/auth-base-account'
import { UnauthorizedException } from '@nestjs/common'

export interface AuthBaseJwtPayload {
    username : string
}

export function authenticate<TAccount extends AuthBaseAccount>
    (request : SecuredEndpointRequest<TAccount>, jwtService : JwtService,
    tokenRequired : boolean = true) : AuthBaseJwtPayload | undefined {

    const authHeader = request.headers.authorization
    const authHeaderParts = authHeader?.split(' ')

    if(authHeaderParts && authHeaderParts.length >= 2 
        && authHeaderParts[0] === 'Bearer') {
        try {
            return jwtService.verify<AuthBaseJwtPayload>(authHeaderParts[1])
        }
        catch (error) {
            if(tokenRequired) {
                throw new UnauthorizedException('Your token is invalid')
            }
        }
    }
    else {
        if(tokenRequired) {
            throw new UnauthorizedException(`'Authorization' header is not provided or is invalid`)
        }
    }

}