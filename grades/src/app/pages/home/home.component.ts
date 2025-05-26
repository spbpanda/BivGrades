import { Component, effect, inject } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  workers = [
    {name: 'Developers', count: '70'},
    {name: 'Analytics', count: '7'},
  ]
}
