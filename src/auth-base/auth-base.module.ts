import { DynamicModule, ForwardReference, Module, Provider, Type } from '@nestjs/common'
import { AccountsServiceImplementation, AuthBaseAccountsService } from './types/auth-base-accounts-service'
import { AuthBaseController } from './auth-base.controller'
import { AUTH_BASE_OPTIONS_KEY, CREDENTIALS_VALIDATOR_KEY, ACCOUNTS_SERVICE_KEY } from './constants'
import { JwtModule } from '@nestjs/jwt'
import { AuthBaseService } from './auth-base.service'
import { ValidationOptions } from './types/validation-options'
import { CredentialsValidator } from './credentials-validator'
import { AuthBaseAccount } from './types/auth-base-account'
import { ExtendedCredentialsValidator } from './types/extended-credentials-validator'

export interface AuthBaseModuleOptions<TAccount extends AuthBaseAccount> {
    accountsService : AccountsServiceImplementation<TAccount>,
    jwtSecretKey : string,
    passwordSalt? : number,
    credentialsValidation? : ValidationOptions,
    customCredentialsValidator? : ExtendedCredentialsValidator

    imports? : (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[],
    providers? : Provider[]
}

@Module({})
export class AuthBaseModule {
    static register
        <TAccount extends AuthBaseAccount>
        (options : AuthBaseModuleOptions<TAccount>) : DynamicModule {

        return {
            module: AuthBaseModule,
            controllers: [ AuthBaseController<TAccount> ],
            providers: [
                {
                    provide: AUTH_BASE_OPTIONS_KEY,
                    useValue: options
                },

                {
                    provide: CREDENTIALS_VALIDATOR_KEY,
                    useValue: options.customCredentialsValidator 
                        ? new options.customCredentialsValidator(options.credentialsValidation)
                        : new CredentialsValidator(options.credentialsValidation)
                },

                {
                    provide: ACCOUNTS_SERVICE_KEY,
                    useClass: options.accountsService
                },
                
                AuthBaseService<TAccount>,

                ...options.providers || []
            ],
            
            imports: [
                JwtModule.register({
                    secret: options.jwtSecretKey,
                    signOptions: { expiresIn: '96h' },
                }),
                ...options.imports || []
            ],

            exports: [ 
                JwtModule,
                {
                    provide: ACCOUNTS_SERVICE_KEY,
                    useClass: options.accountsService
                }
            ]
        }

    }
}