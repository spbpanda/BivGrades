import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SbiAuthService } from './sbi-auth.service';
import { filter, take } from 'rxjs';

/**
 * Сервис, отвечающий за обработку deeplink-переходов.
 *
 * Зачем нужен:
 * В некоторых случаях приложение может быть открыто по специальной ссылке
 * (например, из внешнего письма или стороннего приложения), содержащей параметры в URL,
 * указывающие, что нужно сразу выполнить авторизацию или перейти в конкретный раздел.
 *
 * Пример deeplink: http://localhost:8080/?type=deeplink
 *
 * Основная логика:
 * - Слушает первое завершение маршрутизации после запуска приложения (NavigationEnd)
 * - Проверяет наличие параметра `type=deeplink` в query string
 * - Если параметр найден — вызывает `authDeeplink()` из `SbiAuthService`,
 *   который отвечает за авторизацию пользователя (например, через Keycloak)
 *
 * Где и как используется:
 * - Обычно запускается один раз при инициализации Angular-приложения через `APP_BOOTSTRAP_LISTENER`
 * - Позволяет прозрачно авторизовать пользователя, если он пришёл из внешнего источника по ссылке
 */
@Injectable({
  providedIn: 'root'
})
export class SbiDeeplinkService {
  constructor(
    private router: Router,
    private sbiAuthService: SbiAuthService
  ) {}

  /**
   * Метод, который вызывается при старте приложения.
   * Он ждёт завершения первой навигации, затем проверяет наличие параметра `type=deeplink` в URL
   * и инициирует авторизацию, если параметр найден.
   */
  handleDeeplink(): void {
    this.router.events
      .pipe(
        // Фильтруем только события окончания навигации (NavigationEnd)
        filter(event => event instanceof NavigationEnd),

        // Берём только первое срабатывание после загрузки приложения
        take(1)
      )
      .subscribe(async () => {
        // Получаем query-параметры из текущего URL
        const queryParams = this.router.parseUrl(this.router.url).queryParams;

        // Если есть параметр type=deeplink — запускаем авторизацию через соответствующий сервис
        if (queryParams['type'] === 'deeplink') {
          await this.sbiAuthService.auth();
        }
      });
  }
}

/**
 * Фабричная функция для передачи метода `handleDeeplink` в Angular через `APP_BOOTSTRAP_LISTENER`.
 *
 * Angular позволяет выполнять произвольные действия при инициализации приложения, и данная функция
 * именно это и делает: оборачивает вызов `deeplinkService.handleDeeplink()` в лямбду.
 *
 * Использование:
 * В `providers` корневого модуля нужно зарегистрировать это так:
 *
 * ```ts
 * {
 *   provide: APP_BOOTSTRAP_LISTENER,
 *   useFactory: bootstrapDeeplinkHandler,
 *   deps: [SbiDeeplinkService],
 *   multi: true
 * }
 * ```
 *
 * @param deeplinkService — Инстанс `SbiDeeplinkService`, автоматически внедряется Angular'ом
 * @returns функция, которая будет вызвана после завершения загрузки приложения
 */
export function bootstrapDeeplinkHandler(deeplinkService: SbiDeeplinkService): () => void {
  return () => deeplinkService.handleDeeplink();
}