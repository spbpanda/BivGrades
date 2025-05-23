Рекомендации по добавлению SberId + Keycloak 


1) Установить keycloak-js(https://www.npmjs.com/package/keycloak-js?activeTab=readme) и keycloak-angular(https://www.npmjs.com/package/keycloak-angular?activeTab=readme):
    Если у вас Angular v18:
        npm install keycloak-js@26.2.0
        npm install keycloak-angular@16.1.0
    Если у вас Angular v17:
        npm install keycloak-js@25.0.6
        npm install keycloak-angular@15.3.0
    Если у вас Angular v16:
        npm install keycloak-js@24.0.5
        npm install keycloak-angular@14.4.0
    Если у вас Angular v15:
        npm install keycloak-js@21.1.2
        npm install keycloak-angular@13.1.0
2) Добавить в app.config.ts:
  ...
  import { KeycloakService } from 'keycloak-angular';

  export const appConfig: ApplicationConfig = {
    providers: [
    ...
        provideHttpClient(withInterceptorsFromDi()), // Необходим для работы с backend 
        KeycloakService,
    ...
    ],
  };
3) Используем SbiKeycloakService в том компоненте где хотим получать данные по пользователю:
  ...
    sbiKeycloakService = inject(SbiKeycloakService);
  
    constructor() {
    ...
        effect(() => {
            const data = this.sbiKeycloakService.currentUser();
            data && // делаем что-то с данными по пользователю
        });
    }
  ...

4) Использование кнопки SberId:
    SbiSberidComponent

    Дефолтная кнопка от SberId:
    <sbi-sberid></sbi-sberid>
    
    Кнопка SberId переписанная для Дизайн Системы СБС (рекомендуется к использованию):
    <sbi-sberid [defaultSberId]="false"></sbi-sberid>

5) Deeplink
    Пример deeplink: https://tst.sberbankins.ru/sbi-ds/sbi-story-book/v17?type=deeplink
    В `providers` корневого модуля(к примеру, app.config.ts) нужно зарегистрировать это так:
    {
        provide: APP_BOOTSTRAP_LISTENER,
        useFactory: bootstrapDeeplinkHandler,
        deps: [SbiDeeplinkService],
        multi: true
    }