import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { SbiIconColor, SbiIconSize } from './sbi-icon.models';

/**
 * Компонент иконка
 *
 * Компонент для отображения SVG-иконок из библиотеки.
 *
 * @Component
 * @selector: 'sbi-icon',
 * @standalone: true
 * @templateUrl: './sbi-icon.component.html',
 * @styleUrl: './sbi-icon.component.scss',
 */
@Component({
  selector: 'sbi-icon',
  templateUrl: './sbi-icon.component.html',
  styleUrl: './sbi-icon.component.scss',
  standalone: true
})
export class SbiIconComponent implements OnChanges, AfterViewInit {
  /**
   * @private
   * @description Ссылка на DOM-элемент иконки через ViewChild.
   * @type {ElementRef<HTMLDivElement>}
   * @defaultValue ElementRef<HTMLDivElement>
   */
  @ViewChild('sbiIcon') private _icon?: ElementRef<HTMLDivElement>;

  /**
   * @public
   * @description SVG-изображение иконки в виде строки.
   * @type {string}
   * @defaultValue ''
   * */
  @Input() public iconImage: string = '';

  /**
   * @public
   * @description Размер иконки с фиксированными допустимыми значениями.
   * @type {'12' | '16' | '24' | '32' | '48'}
   * @defaultValue '24'
   * */
  @Input() public size: SbiIconSize = '24';

  /**
   * @public
   * @description Цвет иконки.
   * @type {'primary' | 'tertiary' | 'accent' | 'accenttint' | 'warning' | 'error' | 'information' | 'contrast' | undefined}
   * @defaultValue undefined
   * */
  @Input() public color?: SbiIconColor;

  /**
   * @public
   * @description Идентификатор для тестирования.
   * @type {string}
   * @defaultValue 'sbi-icon'
   * */
  @Input() public testId: string = 'sbi-icon';

  /**
   * @description Вставляет SVG-изображение в DOM, если оно было передано
   */
  ngAfterViewInit() {
    if (this._icon?.nativeElement && this.iconImage) {
      this._icon.nativeElement.innerHTML = this.iconImage;
    }
  }

  /**
   * @description Обновляет SVG-изображение при изменении iconImage
   */
  ngOnChanges(changes: SimpleChanges) {
    // Проверяем, изменилось ли свойство iconImage
    if (this._icon?.nativeElement && changes['iconImage'] && changes['iconImage'].currentValue) {
      this._icon.nativeElement.innerHTML = changes['iconImage'].currentValue;
    }
  }
}
