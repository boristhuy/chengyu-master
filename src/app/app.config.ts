import {ApplicationConfig} from '@angular/core';
import {provideRouter, RouteReuseStrategy, withRouterConfig} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimations} from "@angular/platform-browser/animations";
import {SelectiveRouteReuseStrategy} from "./selective-route-reuse-strategy";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withRouterConfig({onSameUrlNavigation: 'reload'})),
    provideAnimations(),
    {
      provide: RouteReuseStrategy,
      useClass: SelectiveRouteReuseStrategy
    }
  ]
};
