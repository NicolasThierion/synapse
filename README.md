# Synapse <sub>- 0.0.1.alpha</sub>

Annotate functions with es6 decorators to make http requests to an url. 

## Install via npm
  `npm install --save @ack/Synapse` 

Please note that synapse comes with the following polyfills: 
 - **reflect-metadata** ()for [ES7 Metadata Reflection API](http://www.ecma-international.org/ecma-262/6.0/#sec-reflect-object)
 - **whatwg-url** for [ES6 UrlSearchParams](https://url.spec.whatwg.org/#urlsearchparams)

## Setup Synapse with angular.
> ![warning](.README/warning.png) Synapse has only been tested with Angular (>= 5)

Synapse comes with an `HttpBackendAdapter` that makes use of built in angular's `HttpClient`. 
As a result, be sure to import `BrowserModule` and `HttpClientModule` before importing `SynapseModule`.

To be able to use Synapse, your main module (usually `AppModule`) should look like the following: 

```typescript
import { SynapseModule } from '@ack/synapse';

@NgModule({
  // ...
  imports: [
    BrowserModule,
    HttpClientModule,
    SynapseModule.forRoot({
      baseUrl : 'https://your-awesome-api'
    })
  ]
  
  // ...
})
export class AppModule {}
```
> ![info](.README/info.png) Usage with Angular <4 at your own risk. You will need to implement your own `HttpBackendAdapter` based on angular's `Http`

## Setup Synapse without angular.
At the moment, Synapse is intended to be used with Angular. 
Working with any other framework should be fairly easy, as all you need to do is to provide your own `HttpBackendAdapter` that itself relies on standard [Fetch API](https://fetch.spec.whatwg.org/) :
```typescript
import { HttpBackendAdapter } from '@ack/synapse';

class CustomHttpAdapter implements HttpBackendAdapter {
  get(request: Request): Promise<Response>;
  post(request: Request): Promise<Response>;
  put(request: Request): Promise<Response>;
  patch(request: Request): Promise<Response>;
  delete(request: Request): Promise<Response>;
}

const yourHttpAdapter = new CustomHttpAdapter();

Synapse.init({ httpBackend : yourHttpAdapter, baseUrl : 'https://your-awesome-api' });
```
## Simple Synapse API example.
Synapse is annotation driven (well, decorator driven). All you need to do is to put proper annotations on proper classes, methods and parameters, with proper configuration.
```typescript
/**
* Annotate any class with @SynapseApi to turn it into a web api.
*/
@SynapseApi('users')
// @Injectable() If you use angular, you might want to add this.
export class UsersApi {

  /**
  * ex : new UsersApi().getPage({name: 'bob'}) => GET https://your-awesome-api/users?name=bob
  */
  @GET()
  getPage(@QueryParams() params?: Object): Observable<User[]> {
    return Synapse.OBSERVABLE;    // this is some dummy value, just to stop Typescript compiler from complaining about bad return type.
  }

  /**
  * ex : new UsersApi().getOne(12) => GET https://your-awesome-api/users/12
  */
  @GET(':id')
  getOne(@PathParam() id: number): Promise<User> {
    return Synapse.PROMISE;      // saw that ? Synapse also support returning promises.
  }

  /**
  * ex : new UsersApi().postOne(new User()) => POST https://your-awesome-api/users
  */
  @POST()
  postOne(@Body() user: User): Observable<User> {
    return Synapse.OBSERVABLE;
  }

  /**
  * ex : new UsersApi().putOne(new User(), {'x-some-headers': 'some value'}) => POST https://your-awesome-api/users
  */
  @PUT({
     mapper: (userObject) => new User(userObject)  // I want Synapse to automatically map the response to another object.
  })
  putOne(@Body({
    mapper: (user) => { return {id: user.id, name: user.name}}  // This call will only let these two attributes reach the server
  } user: User, @Headers() headers?: any): Observable<User> {
    return Synapse.OBSERVABLE;
  }
}
```
As you can see above, no boilerplate code is needed. 
To issue http request to the server, just naturally call your api like a regular javascript function: 

> ![info](.README/info.png) Method bodies should be empty. If a method has a body, it will be ignored at runtime.

> ![info](.README/info.png) Synapse method can return either a Promise or an [Observable](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html).
Return type is infered from the value your function returns, so be careful to return proper `Synapse.OBSERVABLE` or `Synapse.PROMISE` (any other observable / promise would work as well)

## How to contribute [Out of date]
 - Install the library in dev mode : `cd src; [sudo] npm link`
 - Crank up a local server running a test app : `npm start`
 
## How to test [Out of date]
 - Install the library in dev mode : `cd src; [sudo] npm link`
 - Run tests : `npm test`
 
## FAQ ![Question](.README/question.png) [Out of date]

- I get **Property 'defineMetadata' does not exist on type 'typeof Reflect'**
    
    Did you installed **[reflect-metadata](https://www.npmjs.com/package/reflect-metadata)** polyfill ? 
    If you are using @angular/cli, please add
    ```js
    import 'reflect-metadata';
    ```
    to the file `polyfills.ts`


## TODO

[TODO](./TODO.md) 


## Development server
Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
