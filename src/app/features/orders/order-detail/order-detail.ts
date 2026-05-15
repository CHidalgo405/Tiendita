import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { MxnCurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { Header } from '../../../shared/components/header/header';
import { DatePipe } from '@angular/common';
import { Order, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [MxnCurrencyPipe, Header, DatePipe],
  template: `
    @if (order) {
      <app-header [title]="order.id" [showBack]="true"></app-header>
      <div class="order-detail-page" id="order-detail-page">
        <div class="status-badge" [attr.data-status]="order.status">{{ orderService.getStatusLabel(order.status) }}</div>

        <div class="stepper">
          @for (step of orderService.getStatusSteps(); track step.key) {
            <div class="stepper-step" [class.active]="isStepActive(step.key)" [class.current]="order.status === step.key">
              <div class="step-dot"></div>
              <span class="step-label">{{ step.label }}</span>
            </div>
          }
        </div>

        @if (order.trackingNumber) {
          <div class="tracking-card">
            <span class="tracking-icon">📍</span>
            <div>
              <p class="tracking-label">Número de rastreo</p>
              <p class="tracking-number">{{ order.trackingNumber }}</p>
            </div>
          </div>
        }

        @if (order.estimatedDelivery) {
          <div class="info-card">
            <span>📅</span>
            <p>Entrega estimada: <strong>{{ order.estimatedDelivery | date:'dd/MM/yyyy' }}</strong></p>
          </div>
        }

        <div class="detail-section">
          <h3>Dirección de envío</h3>
          <p>{{ order.shippingAddress.street }} {{ order.shippingAddress.exteriorNumber }}, {{ order.shippingAddress.neighborhood }}</p>
          <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.zipCode }}</p>
        </div>

        <div class="detail-section totals">
          <div class="total-row"><span>Subtotal</span><span>{{ order.subtotal | mxnCurrency }}</span></div>
          @if (order.discount > 0) { <div class="total-row discount"><span>Descuento</span><span>-{{ order.discount | mxnCurrency }}</span></div> }
          <div class="total-row"><span>Envío</span><span>{{ order.shippingCost === 0 ? 'Gratis' : (order.shippingCost | mxnCurrency) }}</span></div>
          <div class="total-row grand"><span>Total</span><span>{{ order.total | mxnCurrency }}</span></div>
        </div>

        @if (order.status === 'pending' || order.status === 'preparing') {
          <button class="cancel-btn" (click)="cancelOrder()" id="cancel-order-btn">Cancelar pedido</button>
        }
      </div>
    }
  `,
  styles: [`
    .order-detail-page { padding: 16px; padding-bottom: 80px; }
    .status-badge { text-align: center; padding: 8px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; margin-bottom: 20px; display: inline-block; width: 100%; }
    [data-status="pending"] { background: #fff3cd; color: #856404; }
    [data-status="preparing"] { background: #cce5ff; color: #004085; }
    [data-status="shipped"] { background: #d4edda; color: #155724; }
    [data-status="delivered"] { background: var(--success-alpha); color: var(--success); }
    [data-status="cancelled"], [data-status="refunded"] { background: var(--danger-alpha); color: var(--danger); }
    .stepper { display: flex; justify-content: space-between; margin-bottom: 24px; padding: 0 8px; position: relative; }
    .stepper::before { content: ''; position: absolute; top: 8px; left: 24px; right: 24px; height: 2px; background: var(--border); z-index: 0; }
    .stepper-step { display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 1; }
    .step-dot { width: 18px; height: 18px; border-radius: 50%; background: var(--surface-raised); border: 2px solid var(--border); }
    .stepper-step.active .step-dot { background: var(--success); border-color: var(--success); }
    .stepper-step.current .step-dot { background: var(--primary); border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-alpha); }
    .step-label { font-size: 0.65rem; font-weight: 600; color: var(--text-muted); }
    .stepper-step.active .step-label, .stepper-step.current .step-label { color: var(--text-primary); }
    .tracking-card, .info-card { display: flex; align-items: center; gap: 12px; padding: 14px; background: var(--surface-raised); border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 12px; }
    .tracking-icon { font-size: 1.3rem; }
    .tracking-label { font-size: 0.75rem; color: var(--text-muted); margin: 0; }
    .tracking-number { font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin: 2px 0 0; }
    .info-card span { font-size: 1.1rem; }
    .info-card p { font-size: 0.85rem; color: var(--text-secondary); margin: 0; }
    .detail-section { margin-bottom: 16px; }
    .detail-section h3 { font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); margin: 0 0 8px; }
    .detail-section p { font-size: 0.85rem; color: var(--text-primary); margin: 2px 0; }
    .totals { padding: 14px; background: var(--surface-raised); border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .total-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 0.85rem; color: var(--text-secondary); }
    .total-row.discount { color: var(--success); }
    .total-row.grand { border-top: 1px solid var(--border); padding-top: 8px; margin-top: 4px; font-weight: 800; color: var(--text-primary); font-size: 1rem; }
    .cancel-btn { display: block; width: 100%; padding: 14px; background: transparent; color: var(--danger); border: 1.5px solid var(--danger); border-radius: 9999px; font-weight: 700; font-size: 0.9rem; cursor: pointer; margin-top: 16px; transition: background 0.2s; }
    .cancel-btn:hover { background: var(--danger-alpha); }
  `],
})
export class OrderDetail implements OnInit {
  protected orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  order: Order | undefined;

  private statusOrder: OrderStatus[] = ['pending', 'preparing', 'shipped', 'delivered'];

  ngOnInit(): void {
    this.route.params.subscribe(p => this.order = this.orderService.getOrderById(p['id']));
  }

  isStepActive(step: OrderStatus): boolean {
    if (!this.order) return false;
    const currentIdx = this.statusOrder.indexOf(this.order.status);
    const stepIdx = this.statusOrder.indexOf(step);
    return stepIdx <= currentIdx;
  }

  cancelOrder(): void {
    if (this.order) {
      this.orderService.cancelOrder(this.order.id);
      this.order = this.orderService.getOrderById(this.order.id);
    }
  }
}
