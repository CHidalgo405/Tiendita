import { Component } from '@angular/core';
import { Header } from '../../../shared/components/header/header';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [Header],
  template: `
    <app-header title="Términos y Privacidad" [showBack]="true"></app-header>
    <div class="terms-page" id="terms-page">
      <section>
        <h2>Términos y Condiciones</h2>
        <p>Al utilizar la aplicación "La Familia", aceptas estos términos y condiciones de uso. Nos reservamos el derecho de modificar estos términos en cualquier momento.</p>
        <p>Los precios mostrados incluyen IVA. La disponibilidad de productos puede variar según la ubicación y el inventario.</p>
      </section>
      <section>
        <h2>Política de Privacidad</h2>
        <p>Recopilamos información personal necesaria para procesar tus pedidos: nombre, dirección, teléfono y correo electrónico.</p>
        <p>Tu información está protegida y no la compartimos con terceros sin tu consentimiento, excepto para procesar envíos y pagos.</p>
      </section>
      <section>
        <h2>Política de Devoluciones</h2>
        <p>Aceptamos devoluciones dentro de los 7 días naturales posteriores a la entrega. Los productos deben estar en su empaque original y sin uso.</p>
      </section>
    </div>
  `,
  styles: [`
    .terms-page { padding: 16px; padding-bottom: 80px; }
    section { margin-bottom: 24px; }
    h2 { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin: 0 0 10px; }
    p { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin: 0 0 8px; }
  `],
})
export class Terms {}
