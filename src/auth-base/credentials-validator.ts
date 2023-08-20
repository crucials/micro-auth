import { Inject, Injectable } from '@nestjs/common'
import { AUTH_BASE_OPTIONS_KEY, EMAIL_REGEX, NO_SPACES_REGEX, NO_SPECIAL_CHARS_REGEX } from './constants'
import { Credentials } from './dto/credentials'
import { CredentialsValidationException } from './exceptions/credentials-validation-exception'
import { BaseValidationOptions, UsernameValidationOptions, ValidationOptions } from './types/validation-options'
import { AuthBaseModuleOptions } from './auth-base.module'
import { AuthBaseAccount } from './types/auth-base-account'

const DEFAULT_VALIDATION_OPTIONS : ValidationOptions = {
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

@Injectable()
export class CredentialsValidatorService<TAccount extends AuthBaseAccount> {
    validationOptions : ValidationOptions

    constructor(@Inject(AUTH_BASE_OPTIONS_KEY) options : AuthBaseModuleOptions<TAccount>) {
        this.validationOptions = options.credentialsValidation
        this.fillMissingOptions()
    }

    validateCredentials(credentials : Credentials) {
        this.validateCredential(credentials.username, 'Username', this.validationOptions.username)
        this.validateCredential(credentials.password, 'Password', this.validationOptions.password)
    }

    private validateCredential(credential : string, credentialName : CredentialName, 
        options : BaseValidationOptions | UsernameValidationOptions) {

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

        let completeUsernameValidationOptions = defaultUsernameOptions
        let completePasswordValidationOptions = defaultPasswordOptions

        if(this.validationOptions) {
            Object.keys(this.validationOptions.username || {}).forEach(optionKey => {
                const optionValue = this.validationOptions.username[optionKey]
                
                if(optionValue !== undefined) {
                    completeUsernameValidationOptions[optionKey] = optionValue
                }
            })

            Object.keys(this.validationOptions.password || {}).forEach(optionKey => {
                const optionValue = this.validationOptions.password[optionKey]
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