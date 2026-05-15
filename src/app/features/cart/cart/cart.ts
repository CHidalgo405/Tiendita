import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { MxnCurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { Header } from '../../../shared/components/header/header';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, FormsModule, MxnCurrencyPipe, Header],
  template: `
    <app-header title="Carrito" [showBack]="true"></app-header>
    <div class="cart-page" id="cart-page">
      @if (cartService.items().length === 0) {
        <div class="empty-state" id="cart-empty">
          <span class="empty-icon">🛒</span>
          <h3>Tu carrito está vacío</h3>
          <p>Agrega productos para empezar a comprar</p>
          <a routerLink="/home" class="btn-explore">Ir a la tienda</a>
        </div>
      } @else {
        <div class="cart-items">
          @for (item of cartService.items(); track item.id) {
            <div class="cart-item" [id]="'cart-item-' + item.id">
              <div class="item-info">
                <h3>{{ item.product.name }}</h3>
                @if (item.selectedVariant) {
                  <span class="variant-label">{{ item.selectedVariant.value }}</span>
                }
                <span class="item-price">{{ item.product.price | mxnCurrency }}</span>
              </div>
              <div class="item-actions">
                <div class="qty-control">
                  <button (click)="cartService.updateQuantity(item.id, item.quantity - 1)">−</button>
                  <span>{{ item.quantity }}</span>
                  <button (click)="cartService.updateQuantity(item.id, item.quantity + 1)">+</button>
                </div>
                <button class="remove-btn" (click)="cartService.removeItem(item.id)">🗑️</button>
              </div>
            </div>
          }
        </div>

        <div class="coupon-section">
          <div class="coupon-input-row">
            <input type="text" [(ngModel)]="couponCode" placeholder="Código de cupón" id="coupon-input" />
            <button (click)="applyCoupon()" class="apply-btn" id="apply-coupon-btn">Aplicar</button>
          </div>
          @if (cartService.coupon()) {
            <div class="coupon-msg" [class.valid]="cartService.coupon()!.valid" [class.invalid]="!cartService.coupon()!.valid">
              {{ cartService.coupon()!.message }}
              @if (cartService.coupon()!.valid) {
                <button class="remove-coupon" (click)="cartService.removeCoupon()">✕</button>
              }
            </div>
          }
        </div>

        <div class="cart-summary">
          <div class="summary-row"><span>Subtotal</span><span>{{ cartService.cart().subtotal | mxnCurrency }}</span></div>
          @if (cartService.cart().discount > 0) {
            <div class="summary-row discount"><span>Descuento</span><span>-{{ cartService.cart().discount | mxnCurrency }}</span></div>
          }
          <div class="summary-row"><span>Envío</span><span>{{ cartService.cart().shipping === 0 ? 'Gratis' : (cartService.cart().shipping | mxnCurrency) }}</span></div>
          <div class="summary-row total"><span>Total</span><span>{{ cartService.cart().total | mxnCurrency }}</span></div>
        </div>

        <a routerLink="/checkout/identify" class="checkout-btn" id="checkout-btn">
          Proceder al pago · {{ cartService.cart().total | mxnCurrency }}
        </a>
      }
    </div>
  `,
  styleUrl: './cart.css',
})
export class Cart {
  protected cartService = inject(CartService);
  couponCode = '';

  applyCoupon(): void {
    if (this.couponCode.trim()) {
      this.cartService.applyCoupon(this.couponCode.trim());
    }
  }
}
