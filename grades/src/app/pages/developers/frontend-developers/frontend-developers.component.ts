import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GradeInfoComponent } from '../../../components/grade/grade-info/grade-info.component';
import { FRONTEND_GRADES } from '../../../const/frontend-grades';
import { Grade } from '../../../models/grade.models';
import { GradeComponent } from '../../../components/grade/grade.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-frontend-developers',
  standalone: true,
  imports: [GradeComponent, MatSidenavModule ],
  templateUrl: './frontend-developers.component.html',
  styleUrl: './frontend-developers.component.scss'
})
export class FrontendDevelopersComponent {
  dialog = inject(MatDialog);
  grades: Grade[] = FRONTEND_GRADES;

  openGradeInfo(grade: Grade) {
    this.dialog.open(GradeInfoComponent, {
      data: grade,
    });
  }

}
