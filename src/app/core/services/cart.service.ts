import { Injectable, signal, computed } from '@angular/core';
import { Cart, CartItem, CouponValidation } from '../models/cart.model';
import { Product, ProductVariant } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  private appliedCoupon = signal<CouponValidation | null>(null);

  readonly items = computed(() => this.cartItems());
  readonly itemCount = computed(() => this.cartItems().reduce((sum, item) => sum + item.quantity, 0));
  readonly coupon = computed(() => this.appliedCoupon());

  readonly cart = computed<Cart>(() => {
    const items = this.cartItems();
    const subtotal = items.reduce((sum, item) => {
      const price = item.selectedVariant?.priceModifier
        ? item.product.price + item.selectedVariant.priceModifier
        : item.product.price;
      return sum + price * item.quantity;
    }, 0);

    const coupon = this.appliedCoupon();
    const discount = coupon?.valid
      ? coupon.discountPercent
        ? subtotal * (coupon.discountPercent / 100)
        : coupon.discountAmount ?? 0
      : 0;

    const shipping = subtotal > 500 ? 0 : 49.99;
    const total = subtotal - discount + shipping;

    return {
      items,
      subtotal,
      discount,
      shipping,
      total: Math.max(0, total),
      couponCode: coupon?.code,
      couponValid: coupon?.valid,
    };
  });

  addItem(product: Product, quantity: number = 1, variant?: ProductVariant): void {
    const current = this.cartItems();
    const existingIndex = current.findIndex(
      (item) => item.product.id === product.id && item.selectedVariant?.id === variant?.id
    );

    if (existingIndex >= 0) {
      const updated = [...current];
      updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + quantity };
      this.cartItems.set(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}`,
        product,
        selectedVariant: variant,
        quantity,
      };
      this.cartItems.set([...current, newItem]);
    }
  }

  removeItem(itemId: string): void {
    this.cartItems.set(this.cartItems().filter((item) => item.id !== itemId));
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }
    const updated = this.cartItems().map((item) => (item.id === itemId ? { ...item, quantity } : item));
    this.cartItems.set(updated);
  }

  applyCoupon(code: string): CouponValidation {
    // Mock coupon validation
    const validCoupons: Record<string, CouponValidation> = {
      FAMILIA10: { code: 'FAMILIA10', valid: true, discountPercent: 10, message: '¡10% de descuento aplicado!' },
      ENVIOGRATIS: { code: 'ENVIOGRATIS', valid: true, discountAmount: 49.99, message: '¡Envío gratis aplicado!' },
    };

    const result = validCoupons[code.toUpperCase()] ?? {
      code,
      valid: false,
      message: 'Cupón inválido o expirado',
    };

    this.appliedCoupon.set(result);
    return result;
  }

  removeCoupon(): void {
    this.appliedCoupon.set(null);
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.appliedCoupon.set(null);
  }
}
