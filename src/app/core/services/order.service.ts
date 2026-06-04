import { Injectable, signal, computed } from '@angular/core';
import { Order, OrderStatus, PaymentMethod, ShippingMethod, SavedPaymentMethod } from '../models/order.model';
import { CartItem } from '../models/cart.model';
import { Address } from '../models/address.model';

const INITIAL_ORDERS: Order[] = [
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
    createdAt: new Date('2026-05-10T12:00:00Z'),
    updatedAt: new Date('2026-05-12T14:30:00Z'),
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
    estimatedDelivery: new Date('2026-05-16T18:00:00Z'),
    createdAt: new Date('2026-05-13T09:15:00Z'),
    updatedAt: new Date('2026-05-14T11:00:00Z'),
  },
];

@Injectable({ providedIn: 'root' })
export class OrderService {
  private ordersSignal = signal<Order[]>([]);

  readonly allOrders = computed(() => this.ordersSignal());

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const storedOrders = localStorage.getItem('admin_orders');
    if (storedOrders) {
      // Parse dates properly
      const parsed: Order[] = JSON.parse(storedOrders).map((o: any) => ({
        ...o,
        createdAt: new Date(o.createdAt),
        updatedAt: new Date(o.updatedAt),
        estimatedDelivery: o.estimatedDelivery ? new Date(o.estimatedDelivery) : undefined,
      }));
      this.ordersSignal.set(parsed);
    } else {
      this.ordersSignal.set(INITIAL_ORDERS);
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('admin_orders', JSON.stringify(this.ordersSignal()));
  }

  getOrders(): Order[] {
    return this.ordersSignal();
  }

  getOrderById(id: string): Order | undefined {
    return this.ordersSignal().find((o) => o.id === id);
  }

  createOrder(items: CartItem[], address: Address, shippingMethod: ShippingMethod, paymentMethod: PaymentMethod, subtotal: number, discount: number, shippingCost: number, total: number): Order {
    const order: Order = {
      id: `ORD-${String(this.ordersSignal().length + 1).padStart(3, '0')}`,
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
    this.ordersSignal.set([order, ...this.ordersSignal()]);
    this.saveToStorage();
    return order;
  }

  cancelOrder(orderId: string): boolean {
    const updated = this.ordersSignal().map((o) =>
      o.id === orderId ? { ...o, status: 'cancelled' as OrderStatus, updatedAt: new Date() } : o
    );
    this.ordersSignal.set(updated);
    this.saveToStorage();
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

  // --- Admin Methods ---

  updateOrderStatus(orderId: string, status: OrderStatus, trackingNumber?: string, estimatedDelivery?: Date): void {
    const updated = this.ordersSignal().map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          trackingNumber: trackingNumber !== undefined ? trackingNumber : o.trackingNumber,
          estimatedDelivery: estimatedDelivery !== undefined ? estimatedDelivery : o.estimatedDelivery,
          updatedAt: new Date(),
        };
      }
      return o;
    });
    this.ordersSignal.set(updated);
    this.saveToStorage();
  }

  updateOrder(order: Order): void {
    this.ordersSignal.set(this.ordersSignal().map((o) => (o.id === order.id ? order : o)));
    this.saveToStorage();
  }
}
