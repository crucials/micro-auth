import { Body, Controller, Get, Inject, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { AuthBaseModuleOptions } from './auth-base.module'
import { AUTH_BASE_OPTIONS_KEY, CREDENTIALS_VALIDATOR_KEY } from './constants'
import { AuthBaseService } from './auth-base.service'
import { Credentials } from './dto/credentials'
import { CredentialsValidatorService } from './credentials-validator'
import { AuthBaseAccount } from './types/auth-base-account'

@Controller('auth')
export class AuthBaseController<TAccount extends AuthBaseAccount> {
    constructor(@Inject(AUTH_BASE_OPTIONS_KEY) 
        private readonly options : AuthBaseModuleOptions<TAccount>,
        private readonly authBaseService : AuthBaseService<TAccount>,
        @Inject(CREDENTIALS_VALIDATOR_KEY)
        private readonly credentialsValidator : CredentialsValidatorService<TAccount>) {}

    @Post('log-in')
    async logIn(@Body() credentials : Credentials) {
        return await this.authBaseService.logIn(credentials)
    }

    @Post('sign-up')
    async signUp(@Body() credentials : Credentials) {
        this.credentialsValidator.validateCredentials(credentials)
        
        return await this.authBaseService.signUp(credentials)
    }
}