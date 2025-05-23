import { Component, Input } from '@angular/core';
import { Grade } from '../../models/grade.models';

@Component({
  selector: 'app-grade',
  standalone: true,
  imports: [],
  templateUrl: './grade.component.html',
  styleUrl: './grade.component.scss'
})
export class GradeComponent {
  @Input() grade: Grade = {} as Grade
}
