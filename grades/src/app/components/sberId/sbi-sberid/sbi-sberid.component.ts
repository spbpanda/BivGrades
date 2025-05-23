import { Component, inject, Input, OnInit } from '@angular/core';
import { SbiSberidService } from './sbi-sberid.service';
import { SbiButtonComponent } from '../sbi-button/sbi-button.component';
import { SbiIconComponent } from '../sbi-icon/sbi-icon.component';

export const BUTTON_SBERID = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_12263_5976" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18">
<path d="M16.1216 3.49536C16.5492 4.04808 16.9111 4.64857 17.2001 5.28476L9.00192 11.3279L5.57568 9.18018V6.59641L9.00192 8.7441L16.1216 3.49536Z" fill="white"/>
<path d="M2.07922 9.00034C2.07922 8.8844 2.08205 8.76923 2.08771 8.65472L0.0113084 8.55298C0.00424104 8.70139 2.50923e-06 8.85122 2.50923e-06 9.00244C-0.00088094 10.184 0.231528 11.354 0.683902 12.4455C1.13627 13.537 1.7997 14.5284 2.63613 15.3629L4.10897 13.8908C3.46512 13.2496 2.95435 12.4874 2.60601 11.6481C2.25768 10.8089 2.07865 9.909 2.07922 9.00034Z" fill="white"/>
<path d="M9.00092 2.07774C9.1168 2.07774 9.23197 2.08198 9.34646 2.08763L9.45036 0.0106069C9.30151 0.00353981 9.15166 6.67467e-06 9.00092 6.67467e-06C7.81878 -0.00143485 6.64807 0.23063 5.55592 0.682877C4.46377 1.13512 3.47172 1.79865 2.63672 2.63534L4.10956 4.10813C4.75084 3.46409 5.51312 2.95315 6.35255 2.6047C7.19199 2.25626 8.09199 2.07717 9.00092 2.07774Z" fill="white"/>
<path d="M9.00003 15.9188C8.88415 15.9188 8.76893 15.9188 8.65376 15.9096L8.54987 17.9859C8.69922 17.9935 8.84929 17.9973 9.00003 17.9973C10.1817 17.9985 11.3518 17.7663 12.4434 17.3139C13.535 16.8615 14.5264 16.1979 15.3607 15.3612L13.8907 13.8892C13.2493 14.5329 12.4871 15.0435 11.6478 15.3918C10.8086 15.7401 9.90874 15.9193 9.00003 15.9188Z" fill="white"/>
<path d="M12.9016 3.28623L14.6514 1.99648C13.052 0.701397 11.0555 -0.003595 8.9975 1.37862e-05V2.07845C10.3911 2.07673 11.7524 2.49787 12.9016 3.28623Z" fill="white"/>
<path d="M18 8.99895C18.0011 8.45826 17.9538 7.9185 17.8586 7.38623L15.9215 8.81379C15.9215 8.87531 15.9215 8.93677 15.9215 8.99895C15.922 9.96593 15.7193 10.9222 15.3265 11.8059C14.9338 12.6895 14.3597 13.4807 13.6415 14.1283L15.0388 15.6725C15.9724 14.8296 16.7185 13.8 17.2286 12.6504C17.7388 11.5007 18.0016 10.2567 18 8.99895Z" fill="white"/>
<path d="M9.00033 15.9215C8.03324 15.9218 7.07686 15.719 6.19308 15.3263C5.30935 14.9336 4.51794 14.3596 3.87011 13.6416L2.3266 15.0381C3.16935 15.9718 4.19896 16.718 5.34867 17.2282C6.49836 17.7384 7.74246 18.0014 9.00033 17.9999V15.9215Z" fill="white"/>
<path d="M4.35916 3.87278L2.96265 2.32861C2.02875 3.17128 1.2824 4.20083 0.772012 5.35049C0.261631 6.50014 -0.00139148 7.74424 5.53598e-06 9.00209H2.07923C2.0788 8.03516 2.28154 7.07885 2.67429 6.19524C3.06705 5.31165 3.64107 4.5204 4.35916 3.87278Z" fill="white"/>
</mask>
<g mask="url(#mask0_12263_5976)">
<rect width="17.9999" height="19.0289" fill="white"/>
</g>
</svg>
`;

/**
 * Компонент `SbiSberidComponent` отвечает за отображение кнопки входа через Сбер ID.
 *
 * Поддерживает два режима отображения:
 *
 * 1. **Автоматический рендер кнопки Сбер ID из SDK** (`defaultSberId: true`)
 *    - В этом случае создаётся контейнер `div` с уникальным ID.
 *    - SDK от Сбера монтирует в него свою кнопку.
 *
 * 2. **Пользовательский режим** (`defaultSberId: false`)
 *    - Отображается кастомная кнопка с иконкой и текстом "Сбер ID".
 *    - При клике вызывается редирект на страницу авторизации Сбера.
 *
*  @Component
 * @selector: 'sbi-sberid'
 * @standalone: true
 * @template: `<div [id]="idContainer"></div>`
 * @styleUrl: './sbi-sberid.component.scss'
 */
@Component({
  selector: 'sbi-sberid',
  standalone: true,
  imports: [
    SbiButtonComponent,
    SbiIconComponent
  ],
  template: `
    @if (defaultSberId) {
      <div [id]="idContainer"></div>
    } @else {
      <sbi-button (click)="goToSberId()" size="small"><sbi-icon [iconImage]="sberIdIcon"></sbi-icon>Сбер ID</sbi-button>
    }
  `,
  styleUrl: './sbi-sberid.component.scss'
})
export class SbiSberidComponent implements OnInit {
  /**
   * @private
   * @description Экземпляр сервиса авторизации с помощью sberid.
   * @type {SbiSberidService}
   * @defaultValue SbiSberidService
   * */
  sbiSberidService = inject(SbiSberidService);

  /**
   * @public
   * @description Определяет режим отображения компонента:
   * - `true`: используется стандартная кнопка Сбера, рендерим `div` для SDK.
   * - `false`: используется кастомная кнопка с ручным вызовом авторизации.
   * @type {boolean}
   * @defaultValue true
   */
  @Input() public defaultSberId: boolean = true;

  /**
   * @public
   * @description идентификатор контейнера.
   * @type {string}
   * @defaultValue 'sberIdButton'
   * */
  public idContainer: string = `sberIdButton`;

  /**
   * Иконка Сбер ID для кастомной кнопки.
   * Импортируется из `public-api` и может быть частью дизайн-системы.
   */
  sberIdIcon = BUTTON_SBERID;

  ngOnInit() {
    this.idContainer = this.generateUniqueId(this.idContainer);
    this.sbiSberidService.initializeSberId(`#${this.idContainer}`);
  }

  /**
   * @private
   * @description Генерирует случайную строку в формате uid.
   * @param {string} baseId - Префикс генерируемой строки
   * @return {string}
   * */
  private generateUniqueId(baseId: string): string {
    const randomString = Math.random().toString(36).substring(2, 6);
    return `${baseId}_${randomString}`;
  }

  /**
   * Обработчик нажатия кастомной кнопки.
   * Запускает редирект на страницу авторизации Сбера.
   */
  goToSberId() {
    this.sbiSberidService.goToAuthorization();
  }
}
