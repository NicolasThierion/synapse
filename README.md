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


## How to contribute
 - Install the library in dev mode : `cd src; [sudo] npm link`
 - Crank up a local server running a test app : `npm start`
 
## How to use test
 - Install the library in dev mode : `cd src; [sudo] npm link`
 - Run tests : `npm test`
 
## FAQ

- I get **Property 'defineMetadata' does not exist on type 'typeof Reflect'**
    
    Did yo installed **[reflect-metadata](https://www.npmjs.com/package/reflect-metadata)** polyfill ? 
    If you are using @angular/cli, please add
    ```js
    import 'reflect-metadata';
    ```
    to the file `polyfills.ts`


## TODO

[TODO](./TODO.md) 


## Development server
Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
