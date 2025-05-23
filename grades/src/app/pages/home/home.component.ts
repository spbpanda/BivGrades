import { Component, effect, inject } from '@angular/core';
import { SbiSberidComponent } from '../../components/sberId/sbi-sberid/sbi-sberid.component';
import { SbiKeycloakService } from '../../components/sberId/services/sbi-keycloak.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SbiSberidComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  workers = [
    {name: 'Developers', count: '70'},
    {name: 'Analytics', count: '7'},
  ]

    sbiKeycloakService = inject(SbiKeycloakService);
    constructor() {
        effect(() => {
            const data = this.sbiKeycloakService.currentUser();
            data && console.log(data)
        });
    }
}
