import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { AuthBaseAccount } from '../types/auth-base-account'
import { AuthBaseAccountsService } from '../types/auth-base-accounts-service'
import { SecuredEndpointRequest } from '../types/secured-endpoint-request'
import { authenticate } from '../utils/authenticate'
import { AuthBaseModuleOptions } from '../auth-base.module'
import { ACCOUNTS_SERVICE_KEY, AUTH_BASE_OPTIONS_KEY } from '../constants'
import { AuthBaseException } from '../exceptions/auth-base-exception'

@Injectable()
export class RolesGuard<TAccount extends AuthBaseAccount & { roles : string[] }> implements CanActivate {
    constructor(private readonly jwtService : JwtService,
        @Inject(ACCOUNTS_SERVICE_KEY)
        private readonly accountsService : AuthBaseAccountsService<TAccount>,
        private readonly reflector : Reflector) {}

        async canActivate(context : ExecutionContext) {
            const request = context.switchToHttp().getRequest<SecuredEndpointRequest<TAccount>>()   

            const accountInfo = authenticate(request, this.jwtService)

            if(!accountInfo) {
                throw new UnauthorizedException('Authentication failed, couldn\'t get your account info')
            }

            const account = await this.accountsService.getAccountByUsername(accountInfo.username)
            
            request.account = account || undefined

            const allowedRoles = this.reflector.getAllAndOverride<string[]>('allowed-roles', [
                context.getClass(), context.getHandler()
            ])

            if(!account) {
                throw new ForbiddenException('Failed to get your account roles')
            }

            if('roles' in account) {
                if(account.roles.some(role => allowedRoles.includes(role))) {
                    return true
                }
                else {
                    throw new ForbiddenException('You don\'t have access to this endpoint')
                }
            }
            else {
                throw new AuthBaseException('To use roles guard, all your accounts '
                    + 'must have the \'roles\' field')
            }
        }    
}