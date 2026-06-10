import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Header } from '../../../shared/components/header/header';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink, Header, IconComponent],
  template: `
    <app-header title="Categorías" [showBack]="true"></app-header>
    <div class="categories-page" id="categories-page">
      <div class="categories-grid">
        @for (cat of productService.getCategories(); track cat.id) {
          <a [routerLink]="['/home/categories', cat.id]" class="category-card" [id]="'category-card-' + cat.id">
            <span class="cat-icon"><app-icon [name]="cat.icon" size="32" /></span>
            <h3>{{ cat.name }}</h3>
            <p>{{ cat.productCount }} productos</p>
          </a>
        }
      </div>
    </div>
  `,
  styles: [`
    .categories-page { padding: 16px; padding-bottom: 80px; }
    .categories-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .category-card {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      padding: 24px 16px; background: var(--surface-raised); border-radius: 16px;
      text-decoration: none; transition: transform 0.2s;
    }
    .category-card:hover { transform: translateY(-3px); }
    .cat-icon { font-size: 2.5rem; }
    .category-card h3 { font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin: 0; text-align: center; }
    .category-card p { font-size: 0.75rem; color: var(--text-secondary); margin: 0; }
    @media (min-width: 768px) { .categories-grid { grid-template-columns: repeat(4, 1fr); } }
  `],
})
export class Categories {
  protected productService = inject(ProductService);
}
