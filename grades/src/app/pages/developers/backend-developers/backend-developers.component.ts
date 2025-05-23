import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GradeComponent } from '../../../components/grade/grade.component';

@Component({
  selector: 'app-backend-developers',
  standalone: true,
    imports: [GradeComponent, MatSidenavModule ],
  templateUrl: './backend-developers.component.html',
  styleUrl: './backend-developers.component.scss'
})
export class BackendDevelopersComponent {

}
