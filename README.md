![Auth base banner with 'Auth base' heading, 'Wrote the routine code for you, so you don't have to' paragraph and decorative icons](https://github.com/crucials/nest-auth-base/assets/83793845/37cd2674-309c-498c-bfcd-3d977a669eb9)

# Nest auth base

Customizable module for JWT username-password authentication & authorization. Create one service, put some guards and it's done

## Installation

```bash
$ npm i nest-auth-base
```

## Simple usage

- Create your account interface, unique username and password are always required. If you want to use roles guard, you must add the `roles` property

```typescript
export interface Account {
  username : string,
  password : string,
  roles : string[],
  reputation : number
}
```

- Create accounts service, so library will be able to manage your datasource. In this example we use just a simple array

```typescript
@Injectable()
export class AccountsService extends AuthBaseAccountsService<Account> {
    private readonly accounts : Account[]

    createAccount(credentials: ProcessedCredentials) {
        const newAccount : Account = {
            username: credentials.username,
            password: credentials.hashedPassword,
            roles: [ 'USER' ],
            reputation: 0 
        }

        this.accounts.push(newAccount)

        return newAccount
    }
    
    getAccountByUsername(username: string) {
        return this.accounts.find(account => account.username === username)
    }
}
```

- Import `AuthBaseModule`. It's global so you can just import it in app module and use guards everywhere
‎‎
```typescript
@Module({
    imports: [
        AuthBaseModule.register({
            accountsService: AccountsService,
            jwtSecretKey: 'YOUR_SECRET_KEY'
        })
    ],
    controllers: [ AppController ],
})
export class AppModule {}
```

It's strongly recommended to get your `jwtSecretKey` from your enviroment variables via [Nest.js config module](https://docs.nestjs.com/techniques/configuration)

Now there are two endpoints available:

<details>
  <summary>
    <code>POST</code> <code><b>/auth/sign-up</b></code>
  </summary>
  
  Accepts body in this format:

  ```json
  {
    "username": "USERNAME",
    "password": "PASSWORD"
  }
  ```
</details>  

<details>
  <summary>
    <code>POST</code> <code><b>/auth/log-in</b></code>
  </summary>
  
  Accepts body in this format:

  ```json
  {
    "username": "USERNAME",
    "password": "PASSWORD"
  }
  ```
</details>

⠀

- Add guards to your whole controller or its methods
  
`AuthGuard` checks if user is authenticated by verifying JWT token in bearer-type `Authorization` header

```typescript
@Controller()
export class AppController {
    @Get('me')
    @UseGuards(AuthGuard)
    async getAccount(@CurrentAccount() account : Account) {   
        return account
    }
}
```

`RolesGuard` checks if user is authenticated and has **one of** specified roles

```typescript
@Controller()
export class AppController {
    @Get('me')
    @AllowedRoles('ADMIN', 'DEVELOPER')
    @UseGuards(RolesGuard)
    async getAccount(@CurrentAccount() account : Account) {   
        return account
    }
}
```

That's all. Now you have secured API

## Learn more

Docs soon
