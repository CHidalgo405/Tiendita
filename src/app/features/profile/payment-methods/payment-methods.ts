import { Component, inject } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { Header } from '../../../shared/components/header/header';

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [Header],
  template: `
    <app-header title="Métodos de Pago" [showBack]="true"></app-header>
    <div class="payments-page" id="payment-methods-page">
      @for (pm of userService.getPaymentMethods(); track pm.id) {
        <div class="pm-card">
          <span class="pm-icon">{{ pm.type === 'card' ? '💳' : pm.type === 'cash' ? '💵' : '🏦' }}</span>
          <div class="pm-info">
            <p class="pm-label">{{ pm.label }} {{ pm.last4 ?? '' }}</p>
            @if (pm.isDefault) { <span class="badge">Principal</span> }
          </div>
          <button class="del-btn" (click)="userService.deletePaymentMethod(pm.id)">🗑️</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .payments-page { padding: 16px; padding-bottom: 80px; }
    .pm-card { display: flex; align-items: center; gap: 12px; padding: 14px; background: var(--surface-raised); border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 10px; }
    .pm-icon { font-size: 1.5rem; }
    .pm-info { flex: 1; }
    .pm-label { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin: 0; }
    .badge { font-size: 0.65rem; background: var(--primary-alpha); color: var(--primary); padding: 2px 8px; border-radius: 4px; font-weight: 600; }
    .del-btn { background: none; border: none; font-size: 1.1rem; cursor: pointer; }
  `],
})
export class PaymentMethods {
  protected userService = inject(UserService);
}
