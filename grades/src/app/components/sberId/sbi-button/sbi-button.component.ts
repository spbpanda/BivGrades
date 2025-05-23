import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SbiButtonAppearance, SbiButtonSize, SbiButtonType } from "./sbi-button.models";

/**
 * Кнопки — это один из ключевых интерактивных элементов интерфейса, которые позволяют пользователям выполнять действия,
 * такие как отправка формы, переход на другую страницу или запуск процесса.
 *
 * Принимает ng-content для отображения контента.
 *
 * @Component
 * @selector: 'sbi-button'
 * @standalone: true
 * @imports: [SbiIconComponent, NgIf, NgClass]
 * @templateUrl: './sbi-button.component.html'
 * @styleUrl: './sbi-button.component.scss'
 * @host: { '[class.disabled]': 'disabled' },
 *  */
@Component({
  selector: 'sbi-button',
  standalone: true,
  imports: [NgClass, MatButtonModule],
  templateUrl: './sbi-button.component.html',
  styleUrl: './sbi-button.component.scss',
  host: {
    '[class.disabled]': 'disabled',
  },
})
export class SbiButtonComponent {

  /**
   * @public
   * @description Размер кнопки.
   * @type {'large' | 'small'}
   * @defaultValue 'large'
   * */
  @Input() public size: SbiButtonSize = 'large';

  /**
   * @public
   * @description Цвет кнопки.
   * @type {'primary' | 'warn' | 'primary-tint' | 'warn-tint' | 'overlay'}
   * @defaultValue 'primary'
   * */
  @Input() public appearance: SbiButtonAppearance = 'primary';

  /**
   * @public
   * @description Тип кнопки.
   * @type {'button' | 'submit' | 'reset'}
   * @defaultValue 'button'
   * */
  @Input() public type: SbiButtonType = 'button';

  /**
   * @public
   * @description Если true, кнопка будет отключена.
   * @type {boolean}
   * @defaultValue false
   * */
  @Input() public disabled: boolean = false;

  /**
   * @public
   * @description Id для авто тестов.
   * @type {string}
   * @defaultValue 'sbi-button'
   * */
  @Input() public testId: string = 'sbi-button';
}
