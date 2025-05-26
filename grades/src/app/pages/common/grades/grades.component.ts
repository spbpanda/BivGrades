import { Component, inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GradeInfoComponent } from '../../../components/grade/grade-info/grade-info.component';
import { GradeComponent } from '../../../components/grade/grade.component';
import { Grade } from '../../../models/grade.models';

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [GradeComponent, MatSidenavModule],
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.scss'
})
export class GradesComponent {
  dialog = inject(MatDialog);
  @Input() grades: Grade[] | null = null;

  openGradeInfo(grade: Grade) {
    this.dialog.open(GradeInfoComponent, {
      data: grade,
    });
  }
}
