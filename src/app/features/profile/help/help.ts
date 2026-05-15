import { Component } from '@angular/core';
import { Header } from '../../../shared/components/header/header';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [Header],
  template: `
    <app-header title="Centro de Ayuda" [showBack]="true"></app-header>
    <div class="help-page" id="help-page">
      @for (faq of faqs; track faq.q) {
        <details class="faq-item">
          <summary>{{ faq.q }}</summary>
          <p>{{ faq.a }}</p>
        </details>
      }
    </div>
  `,
  styles: [`
    .help-page { padding: 16px; padding-bottom: 80px; }
    .faq-item { padding: 14px; background: var(--surface-raised); border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); margin-bottom: 8px; }
    summary { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); cursor: pointer; list-style: none; }
    summary::marker { display: none; }
    .faq-item p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin: 10px 0 0; }
  `],
})
export class Help {
  faqs = [
    { q: '¿Cómo hago un pedido?', a: 'Explora nuestros productos, agrégalos al carrito y sigue el proceso de checkout.' },
    { q: '¿Cuáles son los métodos de pago?', a: 'Aceptamos tarjetas de crédito/débito, efectivo contra entrega y transferencia bancaria.' },
    { q: '¿Cuánto tarda el envío?', a: 'El envío estándar tarda de 3 a 5 días hábiles. El envío express de 1 a 2 días.' },
    { q: '¿Puedo cancelar mi pedido?', a: 'Sí, puedes cancelar tu pedido mientras esté en estado "Pendiente" o "Preparando".' },
    { q: '¿Cómo contacto a soporte?', a: 'Envía un correo a soporte@lafamilia.com o llama al 555-FAMILIA.' },
  ];
}
