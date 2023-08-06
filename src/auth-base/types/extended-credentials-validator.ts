import { CredentialsValidator } from '../credentials-validator'
import { ValidationOptions } from './validation-options'

export type ExtendedCredentialsValidator = new (validationOptions : ValidationOptions) => CredentialsValidator