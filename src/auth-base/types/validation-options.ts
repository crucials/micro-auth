export type BaseValidationOptions = {
    minLength? : number,
    maxLength? : number,
    allowSpecialCharacters? : boolean,
    allowSpaces? : boolean
}

export type UsernameValidationOptions = BaseValidationOptions & { email? : boolean } 

export interface ValidationOptions {
    password? : BaseValidationOptions
    username? : UsernameValidationOptions
}