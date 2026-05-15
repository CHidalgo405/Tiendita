import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { MxnCurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { Header } from '../../../shared/components/header/header';
import { Product, ProductVariant } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, MxnCurrencyPipe, Header],
  template: `
    @if (product) {
      <app-header [title]="product.name" [showBack]="true">
        <button class="fav-btn" (click)="toggleFav()" [id]="'fav-toggle'">{{ productService.isFavorite(product.id) ? '❤️' : '🤍' }}</button>
      </app-header>
      <div class="product-detail" id="product-detail-page">
        <a [routerLink]="['/product', product.id, 'gallery']" class="product-hero">
          <span class="hero-emoji">{{ getCategoryEmoji() }}</span>
          @if (!product.inStock) { <div class="out-overlay">Agotado</div> }
          @if (product.originalPrice) { <span class="discount-tag">-{{ getDiscount() }}%</span> }
        </a>

        <div class="detail-body">
          <h1>{{ product.name }}</h1>
          <div class="rating-row">
            <span>⭐ {{ product.rating }}</span>
            <a [routerLink]="['/product', product.id, 'reviews']" class="reviews-link">({{ product.reviewCount }} reseñas)</a>
          </div>
          <div class="price-row">
            <span class="current-price">{{ getEffectivePrice() | mxnCurrency }}</span>
            @if (product.originalPrice) {
              <span class="old-price">{{ product.originalPrice | mxnCurrency }}</span>
            }
          </div>

          @if (product.variants && product.variants.length > 0) {
            <div class="variants-section">
              <h3>{{ product.variants[0].label }}</h3>
              <div class="variant-chips">
                @for (v of product.variants; track v.id) {
                  <button class="variant-chip"
                    [class.active]="selectedVariant()?.id === v.id"
                    [class.disabled]="!v.inStock"
                    [disabled]="!v.inStock"
                    (click)="selectVariant(v)">
                    {{ v.value }}
                    @if (!v.inStock) { <span class="chip-out">Agotado</span> }
                  </button>
                }
              </div>
            </div>
          }

          <div class="description">
            <h3>Descripción</h3>
            <p>{{ product.description }}</p>
          </div>

          @if (product.inStock) {
            <div class="quantity-section">
              <div class="qty-control">
                <button (click)="changeQty(-1)" [disabled]="quantity() <= 1">−</button>
                <span>{{ quantity() }}</span>
                <button (click)="changeQty(1)" [disabled]="quantity() >= product.stockQuantity">+</button>
              </div>
              <button class="add-to-cart-btn" id="add-to-cart-btn" (click)="addToCart()">
                Agregar al carrito · {{ (getEffectivePrice() * quantity()) | mxnCurrency }}
              </button>
            </div>
          } @else {
            <div class="out-of-stock-msg">
              <p>Este producto no está disponible por el momento</p>
              <button class="notify-btn">Notificarme cuando esté disponible</button>
            </div>
          }
        </div>
      </div>
    }
  `,
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  protected productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  product: Product | undefined;
  selectedVariant = signal<ProductVariant | undefined>(undefined);
  quantity = signal(1);

  ngOnInit(): void {
    this.route.params.subscribe(p => {
      this.product = this.productService.getProductById(p['id']);
    });
  }

  getCategoryEmoji(): string {
    return this.productService.mockCategories.find(c => c.id === this.product?.categoryId)?.icon ?? '📦';
  }

  getDiscount(): number {
    if (!this.product?.originalPrice) return 0;
    return Math.round((1 - this.product.price / this.product.originalPrice) * 100);
  }

  getEffectivePrice(): number {
    const base = this.product?.price ?? 0;
    return base + (this.selectedVariant()?.priceModifier ?? 0);
  }

  selectVariant(v: ProductVariant): void {
    this.selectedVariant.set(v);
  }

  changeQty(delta: number): void {
    this.quantity.update(q => Math.max(1, q + delta));
  }

  toggleFav(): void {
    if (this.product) this.productService.toggleFavorite(this.product.id);
  }

  addToCart(): void {
    if (this.product) this.cartService.addItem(this.product, this.quantity(), this.selectedVariant());
  }
}
