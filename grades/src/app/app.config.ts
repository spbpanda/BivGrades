import { APP_BOOTSTRAP_LISTENER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { KeycloakService } from 'keycloak-angular';
import { bootstrapDeeplinkHandler, SbiDeeplinkService } from './components/sberId/services/sbi-deeplink.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideAnimationsAsync(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    KeycloakService,
    {
      provide: APP_BOOTSTRAP_LISTENER,
      useFactory: bootstrapDeeplinkHandler,
      deps: [SbiDeeplinkService],
      multi: true
    }
  ]
};
