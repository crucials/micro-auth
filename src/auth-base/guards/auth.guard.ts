import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { ACCOUNTS_SERVICE_KEY, AUTH_BASE_OPTIONS_KEY } from '../constants'
import { AuthBaseModuleOptions } from '../auth-base.module'
import { JwtService } from '@nestjs/jwt'
import { AuthBaseAccount } from '../types/auth-base-account'
import { AuthBaseAccountsService } from '../types/auth-base-accounts-service'
import { SecuredEndpointRequest } from '../types/secured-endpoint-request'
import { authenticate } from '../utils/authenticate'

@Injectable()
export class AuthGuard<TAccount extends AuthBaseAccount> implements CanActivate {
    constructor(private readonly jwtService : JwtService,
        @Inject(ACCOUNTS_SERVICE_KEY)
        private readonly accountsService : AuthBaseAccountsService<TAccount>) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<SecuredEndpointRequest<TAccount>>()

        const accountInfo = authenticate(request, this.jwtService)
        request.account = await this.accountsService.getAccountByUsername(accountInfo.username)
        return true
    }
}