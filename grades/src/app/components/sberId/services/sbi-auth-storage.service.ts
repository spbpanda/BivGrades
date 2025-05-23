import { Injectable } from '@angular/core';

/**
 * Сервис для работы с временным хранением авторизационных данных в localStorage.
 *
 * Позволяет сохранять параметры, полученные от Keycloak (state, session_state, code),
 * с возможностью автоматического удаления после истечения времени жизни (TTL).
 *
 * Использование:
 * - `setWithExpiry` — сохранить значение с таймером истечения
 * - `getWithExpiry` — получить значение, проверяя актуальность (по TTL)
 * - `clear` — удалить все связанные ключи из хранилища
 *
 * Это позволяет избежать постоянного хранения чувствительных данных и автоматизировать
 * очистку устаревших токенов.
 */
@Injectable({
  providedIn: 'root'
})
export class SbiAuthStorageService {
  // Ключи для авторизационных данных
  private readonly AUTH_KEYS = {
    STATE: 'state',
    SESSION_STATE: 'session_state',
    CODE: 'code',
  } as const;

  /**
   * Сохраняет значение в localStorage с временем жизни (TTL).
   * 
   * @param key — ключ одного из авторизационных параметров
   * @param value — сохраняемое значение
   * @param ttl — время жизни (в миллисекундах)
   */
  setWithExpiry(key: keyof typeof this.AUTH_KEYS, value: string, ttl: number): void {
    try {
      const item = {
        value,
        expiry: Date.now() + ttl,
      };
      localStorage.setItem(this.AUTH_KEYS[key], JSON.stringify(item));
    } catch (e) {
      console.error('LocalStorage set error:', e);
    }
  }

  /**
   * Получает значение из localStorage, если оно не просрочено.
   * 
   * @param key — ключ одного из авторизационных параметров
   * @returns строка со значением или null, если истек срок хранения или данных нет
   */
  getWithExpiry(key: keyof typeof this.AUTH_KEYS): string | null {
    try {
      const itemStr = localStorage.getItem(this.AUTH_KEYS[key]);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        localStorage.removeItem(this.AUTH_KEYS[key]);
        return null;
      }

      return item.value;
    } catch (e) {
      console.error('LocalStorage get error:', e);
      return null;
    }
  }

  /**
   * Полностью очищает сохранённые авторизационные параметры из localStorage.
   */
  clear(): void {
    Object.values(this.AUTH_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
