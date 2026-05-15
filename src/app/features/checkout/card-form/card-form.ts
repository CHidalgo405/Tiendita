import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../../../shared/components/header/header';

@Component({
  selector: 'app-card-form',
  standalone: true,
  imports: [ReactiveFormsModule, Header],
  template: `
    <app-header title="Datos de Tarjeta" [showBack]="true"></app-header>
    <div class="checkout-page" id="card-form-page">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-layout">
        <div class="form-group"><label>Número de tarjeta</label><input formControlName="number" placeholder="1234 5678 9012 3456" maxlength="19" /></div>
        <div class="form-group"><label>Titular</label><input formControlName="holderName" placeholder="Nombre en la tarjeta" /></div>
        <div class="form-row">
          <div class="form-group"><label>Vencimiento</label><input formControlName="expiry" placeholder="MM/AA" maxlength="5" /></div>
          <div class="form-group"><label>CVV</label><input formControlName="cvv" type="password" placeholder="•••" maxlength="4" /></div>
        </div>
        @if (validating()) {
          <div class="validating-msg">🔄 Validando tarjeta...</div>
        }
        <button type="submit" class="btn-continue" [disabled]="form.invalid || validating()" id="save-card-btn">Guardar y continuar</button>
      </form>
    </div>
  `,
  styleUrl: '../checkout-shared.css',
})
export class CardForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  validating = signal(false);

  form = this.fb.group({
    number: ['', [Validators.required, Validators.minLength(16)]],
    holderName: ['', Validators.required],
    expiry: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
    cvv: ['', [Validators.required, Validators.minLength(3)]],
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.validating.set(true);
      setTimeout(() => {
        this.validating.set(false);
        this.router.navigate(['/checkout/summary']);
      }, 2000);
    }
  }
}
