import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { MxnCurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, FormsModule, MxnCurrencyPipe, IconComponent],
  template: `
    <div class="cart-page" id="cart-page">
      
      <!-- Custom Header matching mockup -->
      <div class="cart-header">
        <div class="header-title">
          <h1>Mi Carrito<br>La Familia</h1>
        </div>
        <button class="search-icon-btn" style="display: flex; align-items: center; justify-content: center;">
          <app-icon name="search" size="24" />
        </button>
      </div>

      @if (cartService.items().length === 0) {
        <div class="empty-state" id="cart-empty">
          <span class="empty-icon" style="display: block; margin-bottom: 12px;"><app-icon name="shopping-cart" size="64" color="var(--text-muted)" /></span>
          <h3>Tu carrito está vacío</h3>
          <p>Agrega productos para empezar a comprar</p>
          <a routerLink="/home" class="btn-explore">Ir a la tienda</a>
        </div>
      } @else {
        <div class="cart-items">
          @for (item of cartService.items(); track item.id) {
            <div class="cart-item-wrapper">
              <div class="cart-item" [id]="'cart-item-' + item.id">
                
                <img [src]="item.product.images[0] || 'https://media.istockphoto.com/id/185284489/photo/orange.jpg?s=612x612&w=0&k=20&c=m4EXniUNMHTOUDOZfm2h-dD01M8l3Q00r6T8j7Bf3G0='" alt="Product" class="item-img" referrerpolicy="no-referrer" />
                
                <div class="item-info">
                  <h3>{{ item.product.name }}</h3>
                  <span class="item-subtitle">{{ item.selectedVariant ? item.selectedVariant.value : 'Fresco' }}</span>
                  <span class="item-price">{{ item.product.price | mxnCurrency }}<small>/{{ item.selectedVariant?.value || 'kg' }}</small></span>
                </div>
                
                <div class="item-qty-vertical">
                  <button (click)="cartService.updateQuantity(item.id, item.quantity + 1)">+</button>
                  <div class="qty-badge">{{ item.quantity < 10 ? '0' + item.quantity : item.quantity }}</div>
                  <button (click)="cartService.updateQuantity(item.id, item.quantity - 1)" [disabled]="item.quantity <= 1">−</button>
                </div>

                <button class="delete-btn" (click)="cartService.removeItem(item.id)" style="display: flex; align-items: center; justify-content: center;">
                  <app-icon name="trash" size="20" />
                </button>

              </div>
            </div>
          }
        </div>

        <div class="cart-bottom-area">
          <div class="total-text">
            Total a pagar <span>{{ cartService.cart().total | mxnCurrency }}</span>
          </div>
          <a routerLink="/checkout/identify" class="checkout-btn" id="checkout-btn">
            Proceder al pago
          </a>
        </div>
      }
    </div>
  `,
  styleUrl: './cart.css',
})
export class Cart {
  protected cartService = inject(CartService);
}
