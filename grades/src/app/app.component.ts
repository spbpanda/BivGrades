import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GradesComponent } from "./pages/grades/grades.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GradesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'grades';
}
