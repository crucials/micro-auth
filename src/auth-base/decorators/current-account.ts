import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const CurrentAccount = createParamDecorator((data, context : ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
        || GqlExecutionContext.create(context).getContext().req

    return request.account
})