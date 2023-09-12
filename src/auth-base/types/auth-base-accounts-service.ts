import { Type } from '@nestjs/common'
import { AuthBaseAccount } from './auth-base-account'
import { CanBePromise } from './can-be-promise'

export type ProcessedCredentials = {
    username : string,
    hashedPassword : string
}

export type AccountsServiceImplementation<TAccount extends AuthBaseAccount> 
    = Type<AuthBaseAccountsService<TAccount>>

export abstract class AuthBaseAccountsService<TAccount extends AuthBaseAccount> {
    abstract createAccount(credentials : ProcessedCredentials) : CanBePromise<TAccount>
    abstract getAccountByUsername(username : string) : CanBePromise<TAccount | null | undefined>
}