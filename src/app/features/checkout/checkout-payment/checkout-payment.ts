import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Header } from '../../../shared/components/header/header';
import { PaymentMethod } from '../../../core/models/order.model';

@Component({
  selector: 'app-checkout-payment',
  standalone: true,
  imports: [RouterLink, Header],
  template: `
    <app-header title="Método de Pago" [showBack]="true"></app-header>
    <div class="checkout-page" id="checkout-payment-page">
      <div class="step-indicator"><span class="step done">✓</span><span class="step done">✓</span><span class="step done">✓</span><span class="step active">4</span></div>
      <div class="options-list">
        @for (opt of paymentOptions; track opt.key) {
          <div class="option-card" [class.selected]="selected() === opt.key" (click)="select(opt.key)">
            <span class="opt-icon">{{ opt.icon }}</span>
            <div class="opt-info"><h3>{{ opt.label }}</h3><p>{{ opt.description }}</p></div>
          </div>
        }
      </div>
      @if (selected() === 'card') {
        <a routerLink="/checkout/payment/card" class="btn-continue" id="card-form-btn">Ingresar datos de tarjeta</a>
      } @else {
        <button class="btn-continue" [disabled]="!selected()" (click)="next()" id="payment-next-btn">Continuar</button>
      }
    </div>
  `,
  styleUrl: '../checkout-shared.css',
})
export class CheckoutPayment {
  private router = inject(Router);
  selected = signal<PaymentMethod | ''>('');

  paymentOptions = [
    { key: 'card' as PaymentMethod, icon: '💳', label: 'Tarjeta de crédito/débito', description: 'Visa, Mastercard, AMEX' },
    { key: 'cash' as PaymentMethod, icon: '💵', label: 'Efectivo', description: 'Paga al recibir tu pedido' },
    { key: 'transfer' as PaymentMethod, icon: '🏦', label: 'Transferencia bancaria', description: 'SPEI / CLABE' },
  ];

  select(key: PaymentMethod): void { this.selected.set(key); }
  next(): void { this.router.navigate(['/checkout/summary']); }
}
