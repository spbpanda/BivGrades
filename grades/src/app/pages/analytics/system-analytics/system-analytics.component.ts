import { Component } from '@angular/core';
import { Grade } from '../../../models/grade.models';
import { GradesComponent } from '../../common/grades/grades.component';
import { SYSTEM_GRADES } from './system-grades';

@Component({
  selector: 'app-system-analytics',
  standalone: true,
  imports: [
    GradesComponent
  ],
  templateUrl: './system-analytics.component.html',
  styleUrl: './system-analytics.component.scss',
})
export class SystemAnalyticsComponent {
  grades: Grade[] = SYSTEM_GRADES;
}
