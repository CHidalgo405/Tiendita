import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { MxnCurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MxnCurrencyPipe],
  template: `
    <div class="home-page" id="home-page">
      
      <!-- Premium Green Top Section -->
      <div class="top-section">
        
        <div class="header-row">
          <div class="location-info">
            <span class="loc-icon">📍</span>
            <div class="loc-text">
              <p>Tu Ubicación</p>
              <h4>Ciudad de México, MX <span class="dropdown-icon">⋁</span></h4>
            </div>
          </div>
          <div class="header-actions">
            <a routerLink="/home" class="action-btn">
              <span class="bell-icon">🔔</span>
              <span class="badge"></span>
            </a>
            <a routerLink="/profile" class="user-avatar">
              {{ authService.user()?.firstName?.charAt(0) || 'U' }}
            </a>
          </div>
        </div>

        <a routerLink="/home/search" class="search-bar" id="home-search-btn">
          <span class="search-icon">🔍</span>
          <span class="search-placeholder">Busca un producto...</span>
        </a>

        <div class="hero-banner">
          <div class="hero-content">
            <h2>¡TU SOLUCIÓN,<br>A UN TOQUE!</h2>
            <p>Servicio rápido, fresco y confiable en la puerta de tu hogar.</p>
            <button class="hero-btn">Explorar</button>
          </div>
          <div class="hero-image">
            <div class="hero-emoji">🥑🛍️</div>
          </div>
        </div>

      </div>

      <!-- Main Content Area -->
      <div class="home-content">
        <section class="section">
          <div class="section-header">
            <h2>Categorías</h2>
            <a routerLink="/home/categories" class="see-all">Ver todas →</a>
          </div>
          <div class="categories-scroll">
            @for (cat of productService.getCategories().slice(0, 6); track cat.id) {
              <a [routerLink]="['/home/categories', cat.id]" class="category-chip" [id]="'cat-' + cat.id">
                <span class="cat-icon">{{ cat.icon }}</span>
                <span class="cat-name">{{ cat.name }}</span>
              </a>
            }
          </div>
        </section>

        <section class="section">
          <div class="section-header">
            <h2>Productos Populares</h2>
          </div>
          <div class="products-grid">
            @for (product of productService.getProducts(); track product.id) {
              <div class="product-card" [id]="'product-' + product.id">
                <a [routerLink]="['/product', product.id]" class="product-link">
                  <div class="product-image">
                    <span class="product-emoji">{{ getCategoryEmoji(product.categoryId) }}</span>
                    @if (product.originalPrice) {
                      <span class="discount-badge">-{{ getDiscount(product) }}%</span>
                    }
                    @if (!product.inStock) {
                      <span class="out-badge">Agotado</span>
                    }
                  </div>
                  <div class="product-info">
                    <h3>{{ product.name }}</h3>
                    <div class="product-rating">⭐ {{ product.rating }} <span>({{ product.reviewCount }})</span></div>
                    <div class="product-price">
                      <span class="price">{{ product.price | mxnCurrency }}</span>
                      @if (product.originalPrice) {
                        <span class="original-price">{{ product.originalPrice | mxnCurrency }}</span>
                      }
                    </div>
                  </div>
                </a>
                @if (product.inStock) {
                  <button class="add-cart-btn" (click)="addToCart(product)" [id]="'add-cart-' + product.id">+</button>
                }
              </div>
            }
          </div>
        </section>
      </div>
    </div>
  `,
  styleUrl: './home.css',
})
export class Home {
  protected productService = inject(ProductService);
  protected authService = inject(AuthService);
  private cartService = inject(CartService);

  getCategoryEmoji(categoryId: string): string {
    return this.productService.mockCategories.find(c => c.id === categoryId)?.icon ?? '📦';
  }

  getDiscount(product: Product): number {
    if (!product.originalPrice) return 0;
    return Math.round((1 - product.price / product.originalPrice) * 100);
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product);
  }
}
