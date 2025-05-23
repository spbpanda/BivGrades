import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, take } from "rxjs";
import { SbiSberidService } from "../sbi-sberid/sbi-sberid.service";
import { SbiKeycloakService } from "./sbi-keycloak.service";
import { ResponseDetails, UserDetailsInfo } from "../models/user-details.model";
import { DocumentExtraData } from "../models/document.model";
/**
 * Сервис для централизованной авторизации пользователя.
 *
 * Назначение:
 * Предоставляет универсальный механизм авторизации, который может использоваться как для deeplink-сценариев,
 * так и для любых других случаев, когда требуется инициировать вход пользователя в систему.
 *
 * Основной функционал:
 * - Проверяет наличие токенов и валидность сессии через `SbiKeycloakService`
 * - В случае неуспешной авторизации — инициирует процесс входа через SberID (`SbiSberidService`)
 *
 * Используемые сервисы:
 * - `SbiKeycloakService`: отвечает за инициализацию и проверку авторизации через Keycloak
 * - `SbiSberidService`: реализует редирект на SberID-авторизацию, если пользователь не авторизован
 *
 * Где может использоваться:
 * - При старте приложения
 * - В навигационных сценариях, где требуется защищённый доступ
 * - При открытии защищённых маршрутов
 * - При авторизации по SberId
 */
@Injectable({
  providedIn: "root",
})
export class SbiAuthService {
  sbiSberIdService = inject(SbiSberidService);
  sbiKeycloakService = inject(SbiKeycloakService);
  router = inject(Router);

  constructor() {}

  /**
   * Запускает процесс авторизации пользователя.
   *
   * Пошаговая логика:
   * 1. Инициирует проверку и инициализацию Keycloak (метод `checkAndInitializeKeycloak`)
   * 2. Если пользователь авторизован — ничего не предпринимается (доступ получен)
   * 3. Если авторизация не удалась или токены отсутствуют — запускается редирект на авторизацию через SberID
   *
   * Примечание:
   * - Метод написан в асинхронном стиле, возвращает observable через await
   * - Ошибки логируются и не прерывают дальнейшую работу приложения
   */
  async auth() {
    (await this.sbiKeycloakService.checkAndInitializeKeycloak())
      .pipe(
        take(1),
        catchError((err) => {
          console.error("Аутентификация прошла с ошибкой: ", err);
          throw err;
        })
      )
      .subscribe((data: ResponseDetails<UserDetailsInfo<DocumentExtraData>> | any) => {
        if (data && data.error) {
          this.authSberId()
        }
      });
  }

  /**
   * Прямой вызов авторизации через SberID без проверки состояния Keycloak.
   *
   * Используется, когда необходимо немедленно отправить пользователя на страницу авторизации —
   * например, при клике на кнопку "Войти".
   *
   * Реализация:
   * - Инициализирует параметры авторизации (`initializeSberId`)
   * - Перенаправляет пользователя на авторизационный сервер (`goToAuthorization`)
   *
   * Важно:
   * - Метод не проверяет наличие токенов или активной сессии
   * - Подходит только для случаев, когда вход пользователя требуется в любом случае через SberId
   */
  authSberId() {
    this.sbiSberIdService.initializeSberId('sbi-auth'+crypto.randomUUID());
    this.sbiSberIdService.goToAuthorization();
  }
}
