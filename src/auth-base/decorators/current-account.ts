import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const CurrentAccount = createParamDecorator((data, context : ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    return request.account
})