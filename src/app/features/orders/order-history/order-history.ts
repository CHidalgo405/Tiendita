import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { MxnCurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { Header } from '../../../shared/components/header/header';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [RouterLink, MxnCurrencyPipe, Header, DatePipe],
  template: `
    <app-header title="Mis Pedidos" [showBack]="true"></app-header>
    <div class="history-page" id="order-history-page">
      @if (orderService.getOrders().length === 0) {
        <div class="empty-state">
          <span>📋</span>
          <h3>Sin pedidos</h3>
          <p>Aún no has realizado ningún pedido.</p>
          <a routerLink="/home" class="btn-shop">Ir a comprar</a>
        </div>
      } @else {
        @for (order of orderService.getOrders(); track order.id) {
          <a [routerLink]="['/orders', order.id]" class="order-card" [id]="'order-' + order.id">
            <div class="order-header">
              <span class="order-id">{{ order.id }}</span>
              <span class="order-status" [attr.data-status]="order.status">{{ orderService.getStatusLabel(order.status) }}</span>
            </div>
            <div class="order-info">
              <span>{{ order.createdAt | date:'dd/MM/yyyy' }}</span>
              <span class="order-total">{{ order.total | mxnCurrency }}</span>
            </div>
          </a>
        }
      }
    </div>
  `,
  styles: [`
    .history-page { padding: 16px; padding-bottom: 80px; }
    .order-card { display: block; padding: 14px; background: var(--surface-raised); border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 10px; text-decoration: none; transition: transform 0.2s; }
    .order-card:hover { transform: translateY(-2px); }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .order-id { font-size: 0.85rem; font-weight: 700; color: var(--text-primary); }
    .order-status { font-size: 0.7rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
    [data-status="pending"] { background: #fff3cd; color: #856404; }
    [data-status="preparing"] { background: #cce5ff; color: #004085; }
    [data-status="shipped"] { background: #d4edda; color: #155724; }
    [data-status="delivered"] { background: var(--success-alpha); color: var(--success); }
    [data-status="cancelled"], [data-status="refunded"] { background: var(--danger-alpha); color: var(--danger); }
    .order-info { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-secondary); }
    .order-total { font-weight: 700; color: var(--primary); }
    .empty-state { text-align: center; padding: 60px 20px; }
    .empty-state span { font-size: 3rem; }
    .empty-state h3 { color: var(--text-primary); margin: 12px 0 6px; }
    .empty-state p { color: var(--text-secondary); font-size: 0.85rem; margin: 0 0 16px; }
    .btn-shop { display: inline-block; padding: 10px 24px; background: var(--secondary); color: #fff; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 0.85rem; transition: background 0.2s; }
    .btn-shop:hover { background: var(--secondary-dark); }
  `],
})
export class OrderHistory {
  protected orderService = inject(OrderService);
}
