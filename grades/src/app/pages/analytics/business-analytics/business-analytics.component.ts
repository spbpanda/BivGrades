import { Component } from '@angular/core';
import { GradesComponent } from '../../common/grades/grades.component';
import { BUSINESS_GRADES } from './business-grades';

@Component({
  selector: 'app-business-analytics',
  standalone: true,
  imports: [
    GradesComponent
  ],
  templateUrl: './business-analytics.component.html',
  styleUrl: './business-analytics.component.scss'
})
export class BusinessAnalyticsComponent {
  grades = BUSINESS_GRADES;

}
