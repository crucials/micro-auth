import { JwtService } from '@nestjs/jwt'
import { SecuredEndpointRequest } from '../types/secured-endpoint-request'
import { AuthBaseAccount } from '../types/auth-base-account'
import { UnauthorizedException } from '@nestjs/common'

export function authenticate<TAccount extends AuthBaseAccount>
    (request: SecuredEndpointRequest<TAccount>, jwtService : JwtService) {

    const authHeader = request.headers.authorization
    const authHeaderParts = authHeader?.split(' ')

    if(authHeaderParts && authHeaderParts.length >= 2 
        && authHeaderParts[0] === 'Bearer') {
        try {
            return jwtService.verify(authHeaderParts[1])
        }
        catch (error) {
            throw new UnauthorizedException('Your token is invalid')
        }
    }
    else {
        throw new UnauthorizedException(`'Authorization' header is not provided or is invalid`)
    }

}