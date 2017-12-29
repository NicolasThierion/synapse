# Synapse <sub>- 0.0.1</sub>

Annotate functions with es6 decorators to make http requests to an url. 

## How to install
 1. via npm
  - `npm install --save git+<REPOSITORY>` 
 2. OR via git :
  - `git clone <REPOSITORY>`
  - `cd synapse && npm install`  

You may also want to install the following dependencies: 
 - **reflect-metadata** if you need a polyfill for [ES7 Metadata Reflection API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)

## Setup Synapse with angular.
> ![warning](.README/warning.png) Synapse has only been tested with Angular (>= 5)

Synapse comes with an `HttpBackendAdapter` that makes uses of the `HttpClient` built in angular. 
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

## Setup Synapse without angular.
At the moment, Synapse is intended to be used with Angular. Working with any other framework should be fairly easy, 
as all you need to do is to provide your own `HttpBackendAdapter` :
```typescript
import { HttpBackendAdapter } from '@ack/synapse';

class CustomHttpAdapter implements HttpBackendAdapter {
  get(url: string, params?: any, headers?: any): Observable<Object> {return null;}
  post(url: string, body?: any, params?: any, headers?: any): Observable<Object> {return null;}
  put(url: string, body?: any, params?: any, headers?: any): Observable<Object> {return null;}
  patch(url: string, body?: any, params?: any, headers?: any): Observable<Object> {return null;}
  delete(url: string, params?: any, headers?: any): Observable<Object> {return null;}  
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
  getOne(@PathParam() id: number): Observable<User> {
    return Synapse.OBSERVABLE;
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
  @PUT()
  putOne(@Body() user: User, @Headers() headers?: any): Observable<User> {
    return Synapse.OBSERVABLE;
  }
}
```
As you can see above, no boilerplate code is needed. 
To issue http request to the server, just naturally call your api like a regular javascript function: 

> ![info](.README/info.png) Method bodies should be empty. If a method has a body, it will be ignored at runtime.
> ![info](.README/info.png) All Synapse method returns an observable.


## How to contribute
 - Install the library in dev mode : `cd src; [sudo] npm link`
 - Crank up a local server running a test app : `npm start`
 
## How to test
 - Install the library in dev mode : `cd src; [sudo] npm link`
 - Run tests : `npm test`
 
## FAQ ![Question](.README/question.png)

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
