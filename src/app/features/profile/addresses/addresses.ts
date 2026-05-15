import { Component, inject } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { Header } from '../../../shared/components/header/header';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [Header],
  template: `
    <app-header title="Mis Direcciones" [showBack]="true"></app-header>
    <div class="addresses-page" id="addresses-page">
      @for (addr of userService.getAddresses(); track addr.id) {
        <div class="addr-card">
          <div class="addr-top"><span class="addr-label">{{ addr.label }}</span>@if (addr.isDefault) { <span class="badge">Principal</span> }</div>
          <p><strong>{{ addr.fullName }}</strong></p>
          <p>{{ addr.street }} {{ addr.exteriorNumber }}, {{ addr.neighborhood }}</p>
          <p>{{ addr.city }}, {{ addr.state }} {{ addr.zipCode }}</p>
          <button class="del-btn" (click)="userService.deleteAddress(addr.id)">Eliminar</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .addresses-page { padding: 16px; padding-bottom: 80px; }
    .addr-card { padding: 14px; background: var(--surface-raised); border-radius: 16px; margin-bottom: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .addr-top { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .addr-label { font-weight: 700; font-size: 0.85rem; color: var(--text-primary); }
    .badge { font-size: 0.65rem; background: var(--primary-alpha); color: var(--primary); padding: 2px 8px; border-radius: 4px; font-weight: 600; }
    p { font-size: 0.8rem; color: var(--text-secondary); margin: 2px 0; }
    .del-btn { margin-top: 8px; background: none; border: none; color: var(--danger); font-size: 0.8rem; font-weight: 600; cursor: pointer; }
  `],
})
export class Addresses {
  protected userService = inject(UserService);
}
