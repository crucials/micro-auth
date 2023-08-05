import { Type } from '@nestjs/common'
import { AuthBaseAccount } from './auth-base-account'

export type ProcessedCredentials = {
    username : string,
    hashedPassword : string
}

export type AccountsServiceImplementation<TAccount extends AuthBaseAccount> 
    = Type<AuthBaseAccountsService<TAccount>>

export abstract class AuthBaseAccountsService<TAccount extends AuthBaseAccount> {
    abstract createAccount(credentials : ProcessedCredentials) : TAccount
    abstract generateJwtPayload(account : TAccount) : any
    abstract getAccountByUsername(username : string) : TAccount | undefined
}