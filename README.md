# Synapse <sub>- 0.2.0</sub>

> Designing clean and versatile HTTP api, made easy. With ES6 decorators, promises, and Fetch API included !

 ## What is it ?
We all already did, one day, some http calls by straight forward concatenating url parts :

```typescript
const BASE_URL='https://my-awesome-web-api-PROD'
class UserApi {
  constructor(private http: HttpClient) {}
  
  getUser(userId: number): Observable { return this.http.get(BASE_URL + '/users/' + userId); }

  getAccount(userId: number): Observable {
    return this.http.get(BASE_URL + '/users/' + userId + '/account/', {
      headers: {
        authorisation: '$$mySecretAuthToken$$'
      }
    });
  }

  searchUser(searchParameters): Observable {
    return this.http.get(BASE_URL + '/users?name=' + searchParameters.name
      + (searchParameters.age ? '&age=' + searchParameters.age : '')
      + (searchParameters.city ? 'city=' + searchParameters.city : ''));
  }
}
```
Tired of all those fuzzy url concatenations and obscure parameter parsing ?
Synapse is a library that allows you to achieve the same as above with much less boilerplate code: 
```typescript
@SynapseApi({
  baseUrl: 'https://my-awesome-web-api-PROD',
  path: 'users'
})
class UserApi {

  @GET(':id')   
  getUser(@PathParams() userId: number) { return Synapse.OBSERVABLE; }

  @GET({
    url: ':id/account',
    requestHandlers: [myAuthRequestHandler]
  })
  getAccount(@PathParams() userId: number) { return Synapse.OBSERVABLE; }

  @GET('users')
  searchUser(@QueryParams() searchParameters) { return Synapse.OBSERVABLE; }
}
```

## Install via npm
  `npm install --save @ack/Synapse` 

Please note that synapse comes with the following polyfills: 
 - **reflect-metadata** ()for [ES7 Metadata Reflection API](http://www.ecma-international.org/ecma-262/6.0/#sec-reflect-object)
 - **whatwg-fetch** for [ES6 Fetch API](https://fetch.spec.whatwg.org/)
 - [Out of date] - **url-search-params-polyfill** for [ES6 UrlSearchParams](https://url.spec.whatwg.org/#urlsearchparams)
 
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

> ![info](.README/info.png) Although it should work seamlessly, usage with plain javascript has not been tested yet.

At the moment, Synapse as only been tested with Angular, but it has been designed to be framework agnostic.
Working with any other framework should be fairly easy, and all you probably need to do is to provide your own `HttpBackendAdapter`.
`HttpBackendAdapter` itself relies on the standard [Fetch API](https://fetch.spec.whatwg.org/) :

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
  }) user: User, @Headers() headers?: any): Observable<User> {
    return Synapse.OBSERVABLE;
  }
}
```
As you can see above, no boilerplate code is needed. 
To issue http request to the server, just naturally call your api like a regular javascript function: 

> ![info](.README/info.png) Method bodies should be empty. If a method has a body, it will be ignored at runtime.

> ![info](.README/info.png) Synapse method can return either a Promise or an [Observable](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html).
Return type is inferred from the value your function returns, so be careful to return proper `Synapse.OBSERVABLE` or `Synapse.PROMISE` (any other observable / promise would work as well)

## Advanced usage

Synapse owns a global configuration of type `SynapseConf`, that is set through the call to `SynapseModule.forRoot(/* ... */)` (or `Synapse.init(/* ... */)` if you don't use angular).

**SynapseConfig**: 

- **`baseUrl`**
  - *type* : `string`  
  - *default value* : `null`  
  - *description* : the base url of your api.
  
- **`requestHandlers`**
  - *type* : `HttpRequestHandler[]`
  - *default value* : `[]`
  - *description* : these hooks are called before each request to the api
  
- **`responseHandlers`**
  - *type* : `HttpResponseHandler[]`
  - *default value* : `[]`
  - *description* : these hooks are called after each response from the api
  
- **`observe`**
  - *type* : `ObserveType`
  - *default value* : `ObserveType.BODY`
  *description* : Observe only the body by default. That is, any method of the API will return a `promise` (or an `Observable`) that holds the (eventually mapped) response's body only.

> ![info](.README/info.png) The same way ObserveType.BODY returns the mapped response body, ObserveType.RESPONSE returns the complete response with the mapped body. 
Because [ES6's Response] as only a limited set of possible body types, ObserveType.RESPONSE returns in fact an object of type TypedResponse, 
that acts as a Response but with a body that holds a complete (non asynchronous) body of any type.
  
- **`headers`**
  - *type* : `Object`
  - *default value* : `{}`
  - *description* : Any global header you want to apply tho all the requests
  
- **`httpBackend`**
  - *type* : `HttpBackendAdapter`
  - *default value* : `HttpClient` (angular) or else `Fetch API`
  - *description* : The Http backend implementation to use to make http requests. You can submit your own adapter.
  
- **`contentType`**
  - *type* : `ContentTypeConstants`
  - *default value* : `ContentTypeConstants.JSON`
  - *description* : Default content type expected to be returned by methods of the API. If an endpoint's Content-Type doesn't return JSON, it will throw an error unless you explicitly configure the proper Content-Type

This configuration is passed down to each of your classes decorated with `@SynapseApi`,
 and to their respective methods decorated with `@GET`, `@POST`, `@PUT`, `@PATCH` or `@DELETE`, which in turn can override it.
**SynapseApiConfig**:
This is the configuration provided to a class decorated with `@SynapseApi`. It is pretty much the same as `SynapseConfig`, 
except it can configure a `path` that comes in addition to the `baseUrl`.

- **`path`**
  - *type* : `string`
  - *default value* : `''`
  - *description* : The `path` is concatenated with the `baseUrl` (either global or overridden), to produce a full URLof form `http://base-url/path`
  
**SynapseApiConfig**:
This is the configuration provided to methods decorated with `@GET`, `@POST`, `@PUT`, `@PATCH` or `@DELETE`. It is pretty much the same as `SynapseApiConfig` 
except it does not allow overriding the `baseUrl`.

- **`path`**
  - *type* : `string`
  - *default value* : `''`
  - *description* : The `path` is concatenated with the `baseUrl` and the `path` defined by a parent, to produce a full URLof form `http://base-url/api-path/endpoint-path`

- **`mapper`**: MapperType<any, any>;
  - *type* : `MapperType`
  - *default value* : `null`
  - *description* : A function that is called when method respond, to map the result to another type.
   This function receive the response's body in argument, and return the mapped object.

> ![info](.README/info.png) Both `@SynapseApi` and `@GET,` `@POST,` etc can configure properties `requestHandlers`, `responseHandlers`, `headers`. 
Providing those configurations will not override existing one but rather merge with it.

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

- **Error: Synapse not initialized**

    Did you properly called `SynapseModule.forRoot(/* ... */)` in your angular's AppModule, or `Synapse.init(/* ... */)` ?
- **Error : has no exported member 'SynapseModule'**
## Development server
Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


[TODO](./TODO.md) 

[CHANGELOG](./CHANGELOG.md) 

This project is licensed under the [MIT License](./LICENCE)
