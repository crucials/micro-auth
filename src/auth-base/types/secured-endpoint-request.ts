import { Request } from 'express'
import { AuthBaseAccount } from './auth-base-account'

export type SecuredEndpointRequest<TAccount extends AuthBaseAccount> 
    = Request & { account: TAccount | undefined }