import { Inject, Injectable } from '@nestjs/common'
import { AUTH_BASE_OPTIONS_KEY, EMAIL_REGEX, NO_SPACES_REGEX, NO_SPECIAL_CHARS_REGEX } from './constants'
import { Credentials } from './dto/credentials'
import { CredentialsValidationException } from './exceptions/credentials-validation-exception'
import { BaseValidationOptions, UsernameValidationOptions, ValidationOptions } from './types/validation-options'
import { AuthBaseModuleOptions } from './auth-base.module'
import { AuthBaseAccount } from './types/auth-base-account'

const DEFAULT_VALIDATION_OPTIONS : FilledValidationOptions = {
    username: {
        email: false,
        allowSpecialCharacters: false,
        maxLength: 18,
        minLength: 3,
        allowSpaces: false
    },
    password: {
        allowSpecialCharacters: true,
        maxLength: 18,
        minLength: 8,
        allowSpaces: false
    }
}

export type CredentialName = 'Username' | 'Password'

type FilledUsernameValidationOptions = Required<UsernameValidationOptions>
type FilledBaseValidationOptions = Required<BaseValidationOptions>
type FilledValidationOptions = {
    username : FilledUsernameValidationOptions,
    password : FilledBaseValidationOptions
}

@Injectable()
export class CredentialsValidatorService<TAccount extends AuthBaseAccount> {
    private validationOptions : ValidationOptions

    constructor(@Inject(AUTH_BASE_OPTIONS_KEY) options : AuthBaseModuleOptions<TAccount>) {
        if(options.credentialsValidation) {
            this.validationOptions = options.credentialsValidation
            this.fillMissingOptions()
        }
        else {
            this.validationOptions = DEFAULT_VALIDATION_OPTIONS
        }
    }

    validateCredentials(credentials : Credentials) {
        this.validateCredential(credentials.username, 'Username', 
            this.validationOptions.username as FilledUsernameValidationOptions)
        this.validateCredential(credentials.password, 'Password', 
            this.validationOptions.password as FilledBaseValidationOptions)
    }

    private validateCredential(credential : string | undefined, credentialName : CredentialName, 
        options : FilledBaseValidationOptions | FilledUsernameValidationOptions) {

        if(typeof credential !== 'string') {
            throw new CredentialsValidationException('Username must be a string')
        }

        const trimmedCredential = credential.trim()
        const validation = options

        if(trimmedCredential.length < validation.minLength
            || trimmedCredential.length > validation.maxLength) {
            throw new CredentialsValidationException(`${credentialName} length must be ` 
                + `minimum of ${validation.minLength} characters and maximum of `
                + `${validation.maxLength}`)
        }

        if('email' in validation && validation.email
            && !trimmedCredential.match(EMAIL_REGEX)) {
            throw new CredentialsValidationException(`${credentialName} must be an email`)
        }

        if(!validation.allowSpecialCharacters && !trimmedCredential.match(NO_SPECIAL_CHARS_REGEX)) {
            throw new CredentialsValidationException(`${credentialName} must not contain any special characters`)
        }
        
        if(!validation.allowSpaces && !trimmedCredential.match(NO_SPACES_REGEX)) {
            throw new CredentialsValidationException(`${credentialName} must not contain spaces`)
        }
    }

    private fillMissingOptions() {
        const defaultUsernameOptions = DEFAULT_VALIDATION_OPTIONS.username
        const defaultPasswordOptions = DEFAULT_VALIDATION_OPTIONS.password

        /*
            dont wanna do type gymnastics so just set an explicit any type
            if you remove it, some error related to "never" type will happen
        */
        let completeUsernameValidationOptions : any = defaultUsernameOptions
        let completePasswordValidationOptions : any = defaultPasswordOptions

        if(this.validationOptions) {
            const checkedValidationOptions : Required<ValidationOptions> = {
                username: this.validationOptions.username || {},
                password: this.validationOptions.password || {}
            }

            Object.keys(checkedValidationOptions.username).forEach(optionKey => {
                const optionValue = checkedValidationOptions.username[
                    optionKey as keyof UsernameValidationOptions
                ]
                
                if(optionValue !== undefined) {
                    completeUsernameValidationOptions[
                        optionKey as keyof FilledUsernameValidationOptions
                    ] = optionValue
                }
            })

            Object.keys(checkedValidationOptions.password).forEach(optionKey => {
                const optionValue = checkedValidationOptions.password[
                    optionKey as keyof BaseValidationOptions
                ]

                if(optionValue) {
                    completePasswordValidationOptions[optionKey] = optionValue
                }
            })
        }
        else {
            completeUsernameValidationOptions = defaultUsernameOptions
            completePasswordValidationOptions = defaultPasswordOptions
        }

        // If username must be an email - force to allow special characters
        if(completeUsernameValidationOptions.email) {     
            completeUsernameValidationOptions.allowSpecialCharacters = true
        }

        this.validationOptions = {
            username: completeUsernameValidationOptions,
            password: completePasswordValidationOptions
        }
    }
}