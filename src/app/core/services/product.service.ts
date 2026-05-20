import { Injectable, signal, computed } from '@angular/core';
import { Product, ProductCategory, ProductReview, SearchFilters } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private favoriteIds = signal<Set<string>>(new Set());

  readonly favorites = computed(() => this.favoriteIds());

  readonly mockCategories: ProductCategory[] = [
    { id: 'cat-1', name: 'Frutas y Verduras', icon: '🥬', imageUrl: '', productCount: 24 },
    { id: 'cat-2', name: 'Lácteos', icon: '🥛', imageUrl: '', productCount: 18 },
    { id: 'cat-3', name: 'Carnes', icon: '🥩', imageUrl: '', productCount: 15 },
    { id: 'cat-4', name: 'Panadería', icon: '🍞', imageUrl: '', productCount: 12 },
    { id: 'cat-5', name: 'Bebidas', icon: '🥤', imageUrl: '', productCount: 30 },
    { id: 'cat-6', name: 'Snacks', icon: '🍿', imageUrl: '', productCount: 22 },
    { id: 'cat-7', name: 'Limpieza', icon: '🧹', imageUrl: '', productCount: 16 },
    { id: 'cat-8', name: 'Cuidado Personal', icon: '🧴', imageUrl: '', productCount: 14 },
  ];

  readonly mockProducts: Product[] = [
    {
      id: 'prod-1', name: 'Manzana Roja (kg)', description: 'Manzanas rojas frescas de temporada, ideales para toda la familia.',
      price: 45.90, originalPrice: 54.90, images: [], category: 'Frutas y Verduras', categoryId: 'cat-1',
      rating: 4.5, reviewCount: 28, inStock: true, stockQuantity: 50, tags: ['oferta', 'fresco'],
    },
    {
      id: 'prod-2', name: 'Leche Entera 1L', description: 'Leche fresca pasteurizada, rica en calcio y vitaminas.',
      price: 28.50, images: [], category: 'Lácteos', categoryId: 'cat-2',
      rating: 4.8, reviewCount: 45, inStock: true, stockQuantity: 100,
    },
    {
      id: 'prod-3', name: 'Pechuga de Pollo (kg)', description: 'Pechuga de pollo sin hueso, fresca y de la mejor calidad.',
      price: 129.90, images: [], category: 'Carnes', categoryId: 'cat-3',
      rating: 4.3, reviewCount: 19, inStock: true, stockQuantity: 30,
      variants: [
        { id: 'v1', type: 'weight', label: 'Peso', value: '500g', priceModifier: -64.95, inStock: true },
        { id: 'v2', type: 'weight', label: 'Peso', value: '1kg', priceModifier: 0, inStock: true },
        { id: 'v3', type: 'weight', label: 'Peso', value: '2kg', priceModifier: 129.90, inStock: false },
      ],
    },
    {
      id: 'prod-4', name: 'Pan Bimbo Grande', description: 'Pan de caja blanco, suave y fresco para toda la familia.',
      price: 62.00, images: [], category: 'Panadería', categoryId: 'cat-4',
      rating: 4.1, reviewCount: 33, inStock: true, stockQuantity: 40,
    },
    {
      id: 'prod-5', name: 'Coca-Cola 2L', description: 'Refresco de cola, perfecto para acompañar tus comidas.',
      price: 35.00, originalPrice: 39.00, images: [], category: 'Bebidas', categoryId: 'cat-5',
      rating: 4.7, reviewCount: 67, inStock: true, stockQuantity: 200,
    },
    {
      id: 'prod-6', name: 'Doritos Nacho 170g', description: 'Totopos de maíz con sabor a nacho, crujientes y deliciosos.',
      price: 48.50, images: [], category: 'Snacks', categoryId: 'cat-6',
      rating: 4.4, reviewCount: 52, inStock: false, stockQuantity: 0,
    },
    {
      id: 'prod-7', name: 'Fabuloso Lavanda 1L', description: 'Limpiador multiusos con aroma a lavanda.',
      price: 32.90, images: [], category: 'Limpieza', categoryId: 'cat-7',
      rating: 4.6, reviewCount: 14, inStock: true, stockQuantity: 60,
    },
    {
      id: 'prod-8', name: 'Plátano (kg)', description: 'Plátanos maduros, ricos en potasio y fibra natural.',
      price: 22.90, images: [], category: 'Frutas y Verduras', categoryId: 'cat-1',
      rating: 4.2, reviewCount: 31, inStock: true, stockQuantity: 80,
    },
  ];

  readonly mockReviews: ProductReview[] = [
    { id: 'r1', userId: 'u1', userName: 'María López', rating: 5, comment: '¡Excelente calidad! Siempre frescos.', date: new Date('2026-05-01') },
    { id: 'r2', userId: 'u2', userName: 'Juan García', rating: 4, comment: 'Buen producto, llegó rápido.', date: new Date('2026-04-28') },
    { id: 'r3', userId: 'u3', userName: 'Ana Martínez', rating: 5, comment: 'Lo mejor de la tienda, lo recomiendo mucho.', date: new Date('2026-04-25') },
  ];

  getCategories(): ProductCategory[] {
    return this.mockCategories;
  }

  getProducts(): Product[] {
    return this.mockProducts;
  }

  getProductsByCategory(categoryId: string): Product[] {
    return this.mockProducts.filter((p) => p.categoryId === categoryId);
  }

  getProductById(id: string): Product | undefined {
    return this.mockProducts.find((p) => p.id === id);
  }

  searchProducts(filters: SearchFilters): Product[] {
    let results = this.mockProducts;

    if (filters.query) {
      const q = filters.query.toLowerCase();
      results = results.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (filters.categoryId) {
      results = results.filter((p) => p.categoryId === filters.categoryId);
    }
    if (filters.minPrice !== undefined) {
      results = results.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc': results.sort((a, b) => a.price - b.price); break;
        case 'price-desc': results.sort((a, b) => b.price - a.price); break;
        case 'rating': results.sort((a, b) => b.rating - a.rating); break;
      }
    }
    return results;
  }

  getReviews(productId: string): ProductReview[] {
    return this.mockReviews;
  }

  toggleFavorite(productId: string): void {
    const current = new Set(this.favoriteIds());
    if (current.has(productId)) {
      current.delete(productId);
    } else {
      current.add(productId);
    }
    this.favoriteIds.set(current);
  }

  isFavorite(productId: string): boolean {
    return this.favoriteIds().has(productId);
  }

  getFavoriteProducts(): Product[] {
    return this.mockProducts.filter((p) => this.favoriteIds().has(p.id));
  }

  getSuggestions(): string[] {
    return ['Leche', 'Pan', 'Huevo', 'Frutas', 'Verduras', 'Pollo', 'Refresco', 'Agua'];
  }
}
