import { Component, inject } from '@angular/core';
import { GradeComponent } from '../../components/grade/grade.component';
import { MatDialog } from '@angular/material/dialog';
import { GradeInfoComponent } from '../../components/grade/grade-info/grade-info.component';
import { FRONTEND_GRADES } from '../../const/frontend-grades';
import { Grade } from '../../models/grade.models';

declare var pay: any;

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [GradeComponent],
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.scss',
})
export class GradesComponent {
  dialog = inject(MatDialog);
  grades: Grade[] = FRONTEND_GRADES;

  openGradeInfo(grade: Grade) {
    this.dialog.open(GradeInfoComponent, {
      data: grade,
    });
  }
}
