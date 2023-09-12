import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { ACCOUNTS_SERVICE_KEY, AUTH_BASE_OPTIONS_KEY } from '../constants'
import { AuthBaseModuleOptions } from '../auth-base.module'
import { JwtService } from '@nestjs/jwt'
import { AuthBaseAccount } from '../types/auth-base-account'
import { AuthBaseAccountsService } from '../types/auth-base-accounts-service'
import { SecuredEndpointRequest } from '../types/secured-endpoint-request'
import { authenticate } from '../utils/authenticate'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Reflector } from '@nestjs/core'

@Injectable()
export class AuthGuard<TAccount extends AuthBaseAccount> implements CanActivate {
    constructor(private readonly jwtService : JwtService,
        @Inject(ACCOUNTS_SERVICE_KEY)
        private readonly accountsService : AuthBaseAccountsService<TAccount>,
        private readonly reflector : Reflector) {}

    async canActivate(context : ExecutionContext) {
        const tokenRequired = this.reflector.getAllAndOverride<boolean>(
            'token-required',
            [ context.getClass(), context.getHandler() ]
        )

        let request = context.switchToHttp().getRequest<SecuredEndpointRequest<TAccount>>()

        if(!request) {
            request = GqlExecutionContext.create(context).getContext().req
        }

        const accountInfo = authenticate(request, this.jwtService, tokenRequired)
        
        if(accountInfo) { 
            request.account = await this.accountsService.getAccountByUsername(accountInfo.username) || undefined
        }

        return true
    }
}