import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ACCOUNTS_SERVICE_KEY, AUTH_BASE_OPTIONS_KEY } from './constants'
import { AuthBaseModuleOptions } from './auth-base.module'
import { JwtService } from '@nestjs/jwt'
import { Credentials } from './dto/credentials'
import * as bcrypt from 'bcryptjs'
import { AuthBaseAccountsService } from './types/auth-base-accounts-service'
import { AuthBaseAccount } from './types/auth-base-account'

@Injectable()
export class AuthBaseService<TAccount extends AuthBaseAccount> {
    constructor(@Inject(AUTH_BASE_OPTIONS_KEY) 
        private readonly options : AuthBaseModuleOptions<TAccount>,
        private readonly jwtService : JwtService,
        @Inject(ACCOUNTS_SERVICE_KEY)
        private readonly accountsService : AuthBaseAccountsService<TAccount>) {}

    async logIn(credentials : Credentials) {
        const { username, password } = credentials

        if(!username || !password) {
            throw new BadRequestException('Your request body must include \'username\''
                + 'and \'password\' fields')
        }

        const targetAccount = await this.accountsService.getAccountByUsername(username)

        if(targetAccount && bcrypt.compareSync(password, targetAccount.password)) {
            return this.generateToken(targetAccount)
        }
        else {
            throw new UnauthorizedException('Invalid username or password')
        }
    }

    async signUp(credentials : Required<Credentials>) {
        const { username, password } = credentials

        const foundAccount = await this.accountsService.getAccountByUsername(username)

        if(foundAccount) {
            throw new BadRequestException(`Account with username '${username}' already exists`)
        }

        const newAccount = await this.accountsService.createAccount({
            username,
            hashedPassword: bcrypt.hashSync(password, this.options.passwordSalt || 8)
        })
        
        return this.generateToken(newAccount)
    }

    private generateToken(account : TAccount) {
        return this.jwtService.sign({
            username: account.username
        })
    }
}