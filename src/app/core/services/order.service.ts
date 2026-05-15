import { Injectable, signal, computed } from '@angular/core';
import { Order, OrderStatus, PaymentMethod, ShippingMethod, SavedPaymentMethod } from '../models/order.model';
import { CartItem } from '../models/cart.model';
import { Address } from '../models/address.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private orders = signal<Order[]>([
    {
      id: 'ORD-001',
      items: [],
      status: 'delivered',
      shippingAddress: { id: 'a1', label: 'Casa', fullName: 'Carlos Hernández', street: 'Av. Reforma', exteriorNumber: '123', neighborhood: 'Centro', city: 'CDMX', state: 'CDMX', zipCode: '06000', phone: '+52 555 123 4567', isDefault: true },
      shippingMethod: 'standard',
      paymentMethod: 'card',
      subtotal: 245.80,
      discount: 24.58,
      shippingCost: 0,
      total: 221.22,
      trackingNumber: 'TRK-ABC123',
      createdAt: new Date('2026-05-10'),
      updatedAt: new Date('2026-05-12'),
    },
    {
      id: 'ORD-002',
      items: [],
      status: 'shipped',
      shippingAddress: { id: 'a1', label: 'Casa', fullName: 'Carlos Hernández', street: 'Av. Reforma', exteriorNumber: '123', neighborhood: 'Centro', city: 'CDMX', state: 'CDMX', zipCode: '06000', phone: '+52 555 123 4567', isDefault: true },
      shippingMethod: 'express',
      paymentMethod: 'transfer',
      subtotal: 189.50,
      discount: 0,
      shippingCost: 49.99,
      total: 239.49,
      trackingNumber: 'TRK-DEF456',
      estimatedDelivery: new Date('2026-05-16'),
      createdAt: new Date('2026-05-13'),
      updatedAt: new Date('2026-05-14'),
    },
  ]);

  readonly allOrders = computed(() => this.orders());

  getOrders(): Order[] {
    return this.orders();
  }

  getOrderById(id: string): Order | undefined {
    return this.orders().find((o) => o.id === id);
  }

  createOrder(items: CartItem[], address: Address, shippingMethod: ShippingMethod, paymentMethod: PaymentMethod, subtotal: number, discount: number, shippingCost: number, total: number): Order {
    const order: Order = {
      id: `ORD-${String(this.orders().length + 1).padStart(3, '0')}`,
      items,
      status: 'pending',
      shippingAddress: address,
      shippingMethod,
      paymentMethod,
      subtotal,
      discount,
      shippingCost,
      total,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set([order, ...this.orders()]);
    return order;
  }

  cancelOrder(orderId: string): boolean {
    const updated = this.orders().map((o) =>
      o.id === orderId ? { ...o, status: 'cancelled' as OrderStatus, updatedAt: new Date() } : o
    );
    this.orders.set(updated);
    return true;
  }

  getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
      pending: 'Pendiente',
      preparing: 'Preparando',
      shipped: 'En camino',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
      refunded: 'Reembolsado',
    };
    return labels[status];
  }

  getStatusSteps(): { key: OrderStatus; label: string }[] {
    return [
      { key: 'pending', label: 'Pendiente' },
      { key: 'preparing', label: 'Preparando' },
      { key: 'shipped', label: 'En camino' },
      { key: 'delivered', label: 'Entregado' },
    ];
  }
}
