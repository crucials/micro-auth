import { BadRequestException } from '@nestjs/common'

export class CredentialsValidationException extends BadRequestException {
    constructor(message : string) {
        super(message)
    }
}