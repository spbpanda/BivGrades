import { Component } from '@angular/core';
import { BACKEND_GRADES } from './backend-grades';
import { Grade } from '../../../models/grade.models';
import { GradesComponent } from '../../common/grades/grades.component';

@Component({
  selector: 'app-backend-developers',
  standalone: true,
  imports: [
    GradesComponent
  ],
  templateUrl: './backend-developers.component.html',
  styleUrl: './backend-developers.component.scss'
})
export class BackendDevelopersComponent {
  grades: Grade[] = BACKEND_GRADES;
}
