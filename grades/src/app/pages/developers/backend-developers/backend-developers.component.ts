import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GradeComponent } from '../../../components/grade/grade.component';
import { GradeInfoComponent } from '../../../components/grade/grade-info/grade-info.component';
import { BACKEND_GRADES } from '../../../const/backend-grades';
import { Grade } from '../../../models/grade.models';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-backend-developers',
  standalone: true,
  imports: [GradeComponent, MatSidenavModule ],
  templateUrl: './backend-developers.component.html',
  styleUrl: './backend-developers.component.scss'
})
export class BackendDevelopersComponent {
  dialog = inject(MatDialog);
  grades: Grade[] = BACKEND_GRADES;

  openGradeInfo(grade: Grade) {
    this.dialog.open(GradeInfoComponent, {
      data: grade,
    });
  }

}
