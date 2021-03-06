// tslint:disable no-implicit-dependencies

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from '../../src/environments/environment.dev';
import { hmrBootstrap } from './hmr';
import { AppModule } from './src/app/app.module';
import './utils/bootstrap-import/bootstrap-imports';
import './utils/font-awesome/font-awesome';

if (environment.production) {
  enableProdMode();
}

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

// bootstraps the app, loading AppModule which defines 'bootstrap' meta.
// this is Hot Module Replacement boilerplate, required to make hmr working in dev mode.
if (module['hot']) {
  hmrBootstrap(module, bootstrap);
} else {
  console.error('HMR is not enabled for webpack-dev-server!');
  console.log('Are you using the --hmr tag for ng serve?');
}
