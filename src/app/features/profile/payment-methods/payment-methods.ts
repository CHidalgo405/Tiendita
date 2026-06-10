import { Component, inject } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { Header } from '../../../shared/components/header/header';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [Header, IconComponent],
  template: `
    <app-header title="Métodos de Pago" [showBack]="true"></app-header>
    <div class="payments-page" id="payment-methods-page">
      @for (pm of userService.getPaymentMethods(); track pm.id) {
        <div class="pm-card">
          <span class="pm-icon" style="display: flex; align-items: center;">
            <app-icon [name]="pm.type === 'card' ? 'credit-card' : pm.type === 'cash' ? 'dollar-sign' : 'landmark'" size="24" />
          </span>
          <div class="pm-info">
            <p class="pm-label">{{ pm.label }} {{ pm.last4 ?? '' }}</p>
            @if (pm.isDefault) { <span class="badge">Principal</span> }
          </div>
          <button class="del-btn" (click)="userService.deletePaymentMethod(pm.id)" style="display: flex; align-items: center; justify-content: center;">
            <app-icon name="trash" size="18" color="var(--danger)" />
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .payments-page { padding: 16px; padding-bottom: 80px; }
    .pm-card { display: flex; align-items: center; gap: 12px; padding: 14px; background: var(--surface-raised); border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 10px; }
    .pm-icon { display: flex; align-items: center; }
    .pm-info { flex: 1; }
    .pm-label { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin: 0; }
    .badge { font-size: 0.65rem; background: var(--primary-alpha); color: var(--primary); padding: 2px 8px; border-radius: 4px; font-weight: 600; }
    .del-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  `],
})
export class PaymentMethods {
  protected userService = inject(UserService);
}
