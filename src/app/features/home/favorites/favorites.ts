import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { MxnCurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { Header } from '../../../shared/components/header/header';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink, MxnCurrencyPipe, Header, IconComponent],
  template: `
    <app-header title="Favoritos" [showBack]="true"></app-header>
    <div class="favorites-page" id="favorites-page">
      @if (productService.getFavoriteProducts().length === 0) {
        <div class="empty-state" id="favorites-empty">
          <span class="empty-icon" style="color: var(--secondary); display: block;"><app-icon name="heart" size="48" fill="currentColor" /></span>
          <h3>Sin favoritos</h3>
          <p>Aún no has agregado productos a tus favoritos. Explora nuestro catálogo.</p>
          <a routerLink="/home" class="btn-explore">Explorar productos</a>
        </div>
      } @else {
        <div class="favorites-list">
          @for (product of productService.getFavoriteProducts(); track product.id) {
            <div class="fav-card" [id]="'fav-' + product.id">
              <a [routerLink]="['/product', product.id]" class="fav-link">
                <div class="fav-thumb">
                  <app-icon [name]="getCategoryIcon(product.categoryId)" size="24" />
                </div>
                <div class="fav-info">
                  <h3>{{ product.name }}</h3>
                  <span class="fav-price">{{ product.price | mxnCurrency }}</span>
                </div>
              </a>
              <div class="fav-actions">
                <button class="fav-remove" (click)="productService.toggleFavorite(product.id)">
                  <app-icon name="trash" size="18" color="var(--danger)" />
                </button>
                @if (product.inStock) {
                  <button class="fav-add-cart" (click)="cartService.addItem(product)">
                    <app-icon name="shopping-cart" size="18" color="var(--primary)" />
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .favorites-page { padding: 16px; padding-bottom: 80px; }
    .empty-state { text-align: center; padding: 60px 20px; }
    .empty-icon { font-size: 3.5rem; }
    .empty-state h3 { color: var(--text-primary); margin: 16px 0 8px; font-size: 1.1rem; }
    .empty-state p { color: var(--text-secondary); font-size: 0.85rem; margin: 0 0 20px; }
    .btn-explore { display: inline-block; padding: 12px 24px; background: var(--primary); color: #fff; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 0.9rem; }
    .favorites-list { display: flex; flex-direction: column; gap: 10px; }
    .fav-card { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--surface-raised); border-radius: 12px; }
    .fav-link { display: flex; align-items: center; gap: 12px; flex: 1; text-decoration: none; }
    .fav-thumb { width: 48px; height: 48px; border-radius: 10px; background: var(--surface); display: flex; align-items: center; justify-content: center; }
    .fav-info h3 { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin: 0 0 2px; }
    .fav-price { font-size: 0.8rem; font-weight: 700; color: var(--primary); }
    .fav-actions { display: flex; gap: 6px; }
    .fav-actions button { background: none; border: none; cursor: pointer; padding: 6px; border-radius: 8px; transition: background 0.2s; display: flex; align-items: center; justify-content: center; }
    .fav-actions button:hover { background: var(--hover); }
  `],
})
export class Favorites {
  protected productService = inject(ProductService);
  protected cartService = inject(CartService);

  getCategoryIcon(categoryId: string): string {
    return this.productService.mockCategories.find(c => c.id === categoryId)?.icon ?? 'package';
  }
}
