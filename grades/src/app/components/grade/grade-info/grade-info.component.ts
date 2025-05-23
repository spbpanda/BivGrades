import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { KeyValuePipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { Grade } from '../../../models/grade.models';

@Component({
  selector: 'app-grade-info',
  standalone: true,
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, KeyValuePipe, MatDividerModule],
  templateUrl: './grade-info.component.html',
  styleUrl: './grade-info.component.scss'
})
export class GradeInfoComponent {
  readonly dialogRef = inject(MatDialogRef<GradeInfoComponent>);
  readonly data = inject<Grade>(MAT_DIALOG_DATA);
  readonly grade = this.data;

  onNoClick(): void {
    this.dialogRef.close();
  }

}
