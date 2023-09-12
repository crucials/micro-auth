import { AuthBaseModuleOptions } from '../auth-base.module'
import { CredentialsValidatorService } from '../credentials-validator'
import { AuthBaseAccount } from './auth-base-account'
import { ValidationOptions } from './validation-options'

export type ExtendedCredentialsValidatorService<TAccount extends AuthBaseAccount> = 
    new (options : AuthBaseModuleOptions<TAccount>) => CredentialsValidatorService<TAccount>