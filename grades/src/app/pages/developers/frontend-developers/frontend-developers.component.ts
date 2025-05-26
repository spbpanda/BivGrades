import { Component } from '@angular/core';
import { FRONTEND_GRADES } from './frontend-grades';
import { Grade } from '../../../models/grade.models';
import { GradesComponent } from '../../common/grades/grades.component';

@Component({
  selector: 'app-frontend-developers',
  standalone: true,
  imports: [
    GradesComponent
  ],
  templateUrl: './frontend-developers.component.html',
  styleUrl: './frontend-developers.component.scss'
})
export class FrontendDevelopersComponent {
  grades: Grade[] = FRONTEND_GRADES;
}
