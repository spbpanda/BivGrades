import { HttpClient, HttpBackend } from '@angular/common/http';
import { computed, Injectable, OnDestroy, Optional, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakConfig } from 'keycloak-js';
import { Subject, Observable, of, switchMap, catchError, firstValueFrom, filter, take, from, tap } from 'rxjs';
import { SbiAuthStorageService } from './sbi-auth-storage.service';
import { DocumentExtraData } from '../models/document.model';
import { ResponseDetails, UserDetailsInfo } from '../models/user-details.model';


/**
 * Сервис для интеграции с Keycloak (OpenID Connect провайдером).
 *
 * Основные задачи:
 * - Проверка доступности Keycloak в текущем окружении
 * - Инициализация Keycloak (режим `check-sso`) и получение access token
 * - Чтение параметров авторизации из URL (`state`, `session_state`, `code`) и их сохранение
 * - Авторизация пользователя на основе полученных параметров
 * - Загрузка пользовательских данных после успешной авторизации
 * - Обработка выхода пользователя (logout) и очистка состояния
 *
 * Внутренние фичи:
 * - Использует `HttpClient` без интерсепторов (через `HttpBackend`) для общения с backend
 *
 * Пример:
 * const user = await sbiKeycloakService.checkAndInitializeKeycloak();
 * 
 * Важно:
 * - При отсутствии параметров авторизации в URL/хранилище сервис ничего не делает.
 * - Ошибки авторизации/загрузки данных не прерывают работу приложения (обрабатываются через catchError).
 */
@Injectable({
  providedIn: 'root'
})
export class SbiKeycloakService implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly httpClient: HttpClient;

  // Конфигурация Keycloak
  private readonly keycloakConfig: KeycloakConfig = {
    url: this.getKeycloakUrlByEnvironment(),
    realm: 'insure-app',
    clientId: 'web-app',
  };

  // Сигналы состояния
  keycloakAvailable = signal(false); // Появляется ли возможность использовать Keycloak
  private keycloakChecked = signal(false); // Было ли уже выполнено определение доступности Keycloak
  currentUser = signal<UserDetailsInfo<DocumentExtraData> | null>(null); // Данные авторизованного пользователя
  readonly keycloakChecked$ = toObservable(
    computed(() => this.keycloakChecked()),
  );

  constructor(
    @Optional() private readonly keycloak: KeycloakService,
    private readonly router: Router, 
    private readonly handler: HttpBackend,
    private readonly authStorage: SbiAuthStorageService,
  ) {
    this.httpClient = new HttpClient(handler); // Создаём HttpClient без интерсепторов
    this.initKeycloakAvailability(); // Определяем, доступен ли Keycloak
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Проверяет и запускает инициализацию Keycloak, если это необходимо.
   * Возвращает observable с пользовательскими данными или null.
   */
  async checkAndInitializeKeycloak(): Promise<Observable<ResponseDetails<UserDetailsInfo<DocumentExtraData>> | ResponseDetails<null> | null>> {
    await this.waitForKeycloakCheck();

    // Если Keycloak не включён или пользователь уже загружен — выходим
    if (this.currentUser()) {
      return of(<ResponseDetails<UserDetailsInfo<DocumentExtraData>>>{data: this.currentUser(), error: null});
    }
    if (!this.isKeycloakEnabled()) {
      return of(<ResponseDetails<null>>{data: null, error: 'Keycloak не инициализирован'});
    }
    // Проверка на наличие параметров авторизации в локальном хранилище
    return this.hasAuthParamsInStorage()
      ? this.initKeycloakAndFetchUser()
      : this.handleAuthParamsFromRoute();
  }

  /**
   * Выход из системы и очистка состояния.
   */
  async logout(redirectUri?: string): Promise<void> {
    if (!this.isKeycloakEnabled()) return;

    try {
      await this.keycloak.logout(redirectUri || window.location.href);
    } catch (error) {
      console.error('[Keycloak] Logout произошла ошибка: ', error);
    } finally {
      this.clearAuthState();
      window.location.href = redirectUri || window.location.href;
    }
  }

  /**
   * Определяет, доступны ли модули keycloak-js и keycloak-angular.
   */
  private async initKeycloakAvailability(): Promise<void> {
    try {
      await Promise.all([
        import('keycloak-angular'),
        import('keycloak-js'),
      ]);
      this.keycloakAvailable.set(true);
    } catch {
      this.keycloakAvailable.set(false);
      console.warn('Необходимы пакетов для работы с Keycloak нет. Авторизация заблокирована. Установите пакеты: keycloak-angular, keycloak-js.');
    } finally {
      this.keycloakChecked.set(true);
    }
  }

  /**
   * Ожидает завершения проверки доступности Keycloak.
   */
  private waitForKeycloakCheck(): Promise<boolean> {
    return firstValueFrom(
      this.keycloakChecked$.pipe(
        filter(checked => checked),
        take(1)
      )
    );
  }

  /**
   * Проверка: можно ли использовать Keycloak в текущем окружении.
   */
  private isKeycloakEnabled(): boolean {
    return this.keycloakAvailable() && !!this.keycloak;
  }

  /**
   * Проверяет наличие параметров авторизации в localStorage.
   */
  private hasAuthParamsInStorage(): boolean {
    return (
      !!this.authStorage.getWithExpiry('STATE') &&
      !!this.authStorage.getWithExpiry('SESSION_STATE') &&
      !!this.authStorage.getWithExpiry('CODE')
    );
  }

  /**
   * Обрабатывает параметры авторизации из URL и сохраняет их в хранилище.
   * После этого запускает инициализацию Keycloak.
   */
  private handleAuthParamsFromRoute(): Observable<ResponseDetails<UserDetailsInfo<DocumentExtraData>> | ResponseDetails<null> | null> {
    const queryParams = new URLSearchParams(window.location.search);

    const state = queryParams.get('state');
    const sessionState = queryParams.get('session_state');
    const code = queryParams.get('code');
    const hasAuthParams = state && sessionState && code;
    
    if (hasAuthParams) {
      this.persistAuthParams({
        state,
        session_state: sessionState,
        code,
      });
      return this.initKeycloakAndFetchUser()
    }
    return of(<ResponseDetails<null>>{data: null, error: 'Нет параметров для аутентификации в Keycloak'});
  }

  /**
   * Сохраняет параметры авторизации в localStorage с TTL 30 минут.
   */
  private persistAuthParams(params: Record<string, string>): void {
    const ttl = 30 * 60 * 1000;
    this.authStorage.setWithExpiry('STATE', params['state'], ttl);
    this.authStorage.setWithExpiry('SESSION_STATE', params['session_state'], ttl);
    this.authStorage.setWithExpiry('CODE', params['code'], ttl);
  }

  /**
   * Инициализирует Keycloak и загружает данные пользователя.
   */
  private initKeycloakAndFetchUser(): Observable<ResponseDetails<UserDetailsInfo<DocumentExtraData>> | null> {
    return this.initKeycloak().pipe(
      switchMap(token => {
        if (!token) {
          console.warn('[Keycloak] Keycloak вернул пустой токен. Пользователь не авторизован.');
          this.clearAuthState();
          return of(null);
        }
        return this.fetchAndStoreUserDetails(token);
      }),
      catchError(err => {
        console.error('Ошибка при инициализации или получении данных по пользователю:', err);
        return of(null);
      })
    );
  }

  /**
   * Производит инициализацию Keycloak (check-sso) и возвращает access token.
   */
  private initKeycloak(): Observable<string> {
    const config = { ...this.keycloakConfig, url: this.getKeycloakUrlByEnvironment() };
  
    // Очищаем URL от auth-параметров
    const url = new URL(window.location.href);
    url.searchParams.delete('state');
    url.searchParams.delete('session_state');
    url.searchParams.delete('code');
    url.searchParams.delete('type');

    return from(
      this.keycloak.init({
        config,
        initOptions: {
          onLoad: 'check-sso',
          checkLoginIframe: false,
          enableLogging: false,
          redirectUri: url.toString()
        },
      })
    ).pipe(
      switchMap((authenticated: boolean) => {
        if (!authenticated) {
          console.warn('[Keycloak] Пользователь не авторизован');
          throw new Error('[Keycloak] Пользователь не авторизован');
        }
        return from(this.keycloak.getToken());
      }),
      switchMap((token: string | undefined) => {
        if (!token) {
          console.warn('[Keycloak] Токен не получен');
          throw new Error('[Keycloak] Токен не получен');
        }
  
        return of(token);
      }),
      catchError(err => {
        console.error('[Keycloak] Инициализация произошла с ошибкой:', err);
        throw new Error('[Keycloak] Инициализация произошла с ошибкой');
      })
    );
  }

  /**
   * Загружает данные пользователя по access token и сохраняет их.
   * если данные пришли по пользователю - отправляет метрику
   */
  private fetchAndStoreUserDetails(token: string): Observable<ResponseDetails<UserDetailsInfo<DocumentExtraData>> | null> {
    return this.refreshPostLogin(token).pipe(
      switchMap(() => this.fetchUserDetails(token)),
      tap(user => {
        this.currentUser.set(user?.data ?? null);
        if (user && user.data) {
          // TODO: заменить на метрику с помощью YandexMetrikaService
          // YandexMetrikaService.sendSuccessfullAuthorizationMetric(this.getProductNameFromUrl());
        }
        this.cleanerUrl();
      }),
      catchError(err => {
        console.error('Не пришли данные по пользователю:', err);
        this.currentUser.set(null);
        return of(null);
      })
    );
  }

  /**
   * Метод получения наименования продукта для метрики после store/
   * например https://online.sberbankins.ru/store/travel-online-v3/ (travel-online-v3)
   * @returns {string}
   */
  private getProductNameFromUrl(): string {
    return window.location.pathname.split('/').filter(Boolean)[1];
  }

  /**
   * Очищаем URL от того что мы не хотим там видеть
   */
  private cleanerUrl(): void {
    const url = new URL(window.location.href);

    // Удаляем также из hash, если keycloak добавил параметры туда
    if (url.hash) {
      const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));
      hashParams.delete('state');
      hashParams.delete('session_state');
      hashParams.delete('code');

      const newHash = hashParams.toString();
      url.hash = newHash ? `#${newHash}` : '';
    }

    // Обновляем URL в адресной строке без перезагрузки
    window.history.replaceState({}, '', url.toString());
  }

  /**
   * POST-запрос на бэкенд для пост-авторизационного обновления состояния.
   */
  private refreshPostLogin(token: string): Observable<any> {
    return this.httpClient.post(
      '/api-gate/v1/policy/refresh-post-login',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  /**
   * Получение данных пользователя с бэкенда.
   */
  private fetchUserDetails(token: string): Observable<ResponseDetails<UserDetailsInfo<DocumentExtraData>>> {
    return this.httpClient.post<ResponseDetails<UserDetailsInfo<DocumentExtraData>>>(
      '/api-gate/v1/user-profile/details',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  /**
   * Полная очистка локального состояния авторизации.
   */
  private clearAuthState(): void {
    this.currentUser.set(null);
    this.authStorage.clear();
  }

  /**
   * Возвращает URL для Keycloak в зависимости от окружения.
   */
  private getKeycloakUrlByEnvironment(): string {
    const host = window.location.hostname;
    if (host.includes('localhost') || host.includes('dev.') || host.includes('tst.')) {
      return 'https://tst.sberbankins.ru/auth';
    } else if (host.includes('prep.')) {
      return 'https://prep.sberbankins.ru/auth';
    }
    return 'https://auth.sberbankins.ru/auth';
  }
}