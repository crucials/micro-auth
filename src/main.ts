import { AuthBaseController } from './auth-base/auth-base.controller'
import { AuthBaseModule, AuthBaseModuleOptions } from './auth-base/auth-base.module'
import { AuthBaseService } from './auth-base/auth-base.service'
import { CredentialName, CredentialsValidatorService } from './auth-base/credentials-validator'
import { AllowedRoles } from './auth-base/decorators/allowed-roles'
import { CurrentAccount } from './auth-base/decorators/current-account'
import { Credentials } from './auth-base/dto/credentials'
import { AuthBaseException } from './auth-base/exceptions/auth-base-exception'
import { CredentialsValidationException } from './auth-base/exceptions/credentials-validation-exception'
import { AuthGuard } from './auth-base/guards/auth.guard'
import { RolesGuard } from './auth-base/guards/roles.guard'
import { AuthBaseAccount } from './auth-base/types/auth-base-account'
import { AccountsServiceImplementation, AuthBaseAccountsService, ProcessedCredentials } from './auth-base/types/auth-base-accounts-service'
import { ExtendedCredentialsValidatorService } from './auth-base/types/extended-credentials-validator'
import { SecuredEndpointRequest } from './auth-base/types/secured-endpoint-request'
import { BaseValidationOptions, UsernameValidationOptions, ValidationOptions } from './auth-base/types/validation-options'

export {
    AuthBaseModule,
    AuthBaseController,
    AuthBaseService,

    AuthBaseAccount,
    AuthBaseModuleOptions,
    AuthBaseAccountsService,
    AccountsServiceImplementation,

    Credentials,
    ProcessedCredentials,
    CredentialName,
    CredentialsValidatorService,
    ExtendedCredentialsValidatorService,
    ValidationOptions,
    UsernameValidationOptions,
    BaseValidationOptions,

    SecuredEndpointRequest,

    AuthGuard,
    RolesGuard,

    AllowedRoles,
    CurrentAccount,

    AuthBaseException,
    CredentialsValidationException,
}