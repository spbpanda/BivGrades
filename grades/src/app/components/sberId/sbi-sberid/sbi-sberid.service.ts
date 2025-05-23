import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import {
  CLIENT_CLOUD_ID,
  CLIENT_NAME,
  CLIENT_TYPE,
  KC_IDP_HINT,
  PROD_LOC_URL,
  PROD_URL,
  TEST_LOC_URL
} from './sbi-sberid.const';
import { SbiKeycloakService } from '../services/sbi-keycloak.service';

declare class SberidSDK {
  init(): any;

  constructor(params: any);
}

/**
 * Сервис необходим для работы с кнопкой SberId
 * Более подробную информацию можно найти тут
 * https://developers.sber.ru/docs/ru/sberid/sdk/javascript/current/connection
 *
 * @Injectable
 */
@Injectable({
  providedIn: 'root',
})
export class SbiSberidService {
  /**
   * @private
   * @description Домен, на котором развёрнут проект.
   * @type {string}
   * @defaultValue ''
   * */
  private sberServUrl: string = '';

  /**
   * @private
   * @description Объект location из window. используется для получения текущего адреса.
   * @type {any}
   * @defaultValue (window as any).location
   * */
  private location: any = (window as any).location;

  /**
   * @private
   * @description Инициализирован sdk или нет. Защищает от повторной инициализации.
   * @type {boolean}
   * @defaultValue false
   * */
  private isInitialized: boolean = false;

  /**
   * @private
   * @description Загружает скрипт SberID SDK.
   * @returns Observable, который эмитит событие, когда скрипт загружен.
   */
  private loadScript(): Observable<void> {
    return new Observable((observer) => {
      const script = document.createElement('script');
      script.src = 'https://id.sber.ru/sdk/web/sberid-sdk.production.js';
      script.onload = () => {
        observer.next();
        observer.complete();
      };
      script.onerror = (error) => {
        observer.error(new Error('Failed to load SberID SDK'));
      };
      document.head.appendChild(script);
      this.setLocalSberUrl();
    });
  }

  /**
   * @private
   * @description Устанавливает текущий адрес.
   */
  private setLocalSberUrl() {
    const hostname = (window as any).location.hostname;
    const localSberUrl = hostname.includes('localhost') || hostname.includes('dev.') ? TEST_LOC_URL : hostname;

    if (hostname === PROD_LOC_URL) {
      this.sberServUrl = PROD_URL;
    } else {
      this.sberServUrl = localSberUrl;
    }
  }

  /**
   * @private
   * @getter
   * @description Возвращает URL для авторизации через SberID с помощью KeyCloak
   * @return {string}
   */
  private get universalLink(): string {
    const uid = crypto.randomUUID();
    let url = `https://${this.sberServUrl}/auth/realms/insure-app/protocol/openid-connect/auth?response_type=code&display=page&channel=browser&scope=openid&personalization=false&client_id=${CLIENT_CLOUD_ID}&kc_idp_hint=${KC_IDP_HINT}&oidcReferrer=${encodeURIComponent(this.location.origin)}&redirect_uri=${encodeURIComponent(this.location.href)}&logUid=${encodeURIComponent(uid)}&client_type=${CLIENT_TYPE}&state=${crypto.randomUUID()}.web-app&nonce=${crypto.randomUUID()}`;
    return url;
  }

  /**
   * @public
   * @description Перенаправляет на авторизацию
   */
  public goToAuthorization() {
    setTimeout(() => {
      window.location.href = this.universalLink;
    })
  }

  /**
   * @private
   * @description Инициализирует SberID SDK.
   * @param {string} containerId Идентификатор контейнера в который загрузится кнопка входа по sberId.
   */
  private sberIdSDKButton(containerId: string): void {
    // Параметры необходимые для заполнения
    const params = {
      oidc: {
        client_id: CLIENT_CLOUD_ID,
        client_type: CLIENT_TYPE,
        nonce: crypto.randomUUID(),
        redirect_uri: (window as any).location.href,
        state: crypto.randomUUID(),
        scope: 'openid',
        response_type: 'code',
        name: CLIENT_NAME,
        login_hint: ''// номер телефона
      },
      container: containerId,
      personalization: false,
      debug: false,
      notification: {
        enable: false,
      },
      fastLogin: {
        enable: true,
        timeout: 1000,
        mode: 'auto',
      },
      buttonProps: {
        stretched: true,
        changeUser: true,
        size: 'md'
      },
      onButtonClick: () => {
        this.goToAuthorization();
      },
      onSuccessCallback: async (e: any) => {
        await inject(SbiKeycloakService).checkAndInitializeKeycloak();
      }
    };

    const sdk = new SberidSDK(params);
    sdk.init()
  }

  /**
   * @public
   * @description Загружает скрипт и инициализирует SberID SDK.
   * @param {string} containerId Идентификатор контейнера в который загрузится кнопка входа по sberId.
   */
  public initializeSberId(containerId: string): void {
    if (this.isInitialized) {
      this.sberIdSDKButton(containerId);
    } else {
      this.loadScript().pipe(take(1)).subscribe({
        next: () => {
          this.sberIdSDKButton(containerId);
          this.isInitialized = true;
        },
        error: (err) => {
          console.error('Ошибка при инициализации SberID SDK:', err);
        },
      });
    }
  }
}
