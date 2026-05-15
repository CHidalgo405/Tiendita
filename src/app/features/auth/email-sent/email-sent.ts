import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-email-sent',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="auth-page" id="email-sent-page">
      <div class="auth-header">
        <div class="auth-logo">✉️</div>
        <h1>Correo Enviado</h1>
        <p>Hemos enviado un enlace de recuperación a:</p>
        <p class="email-display">{{ email }}</p>
      </div>

      <div class="auth-form">
        <div class="info-card">
          <p>Revisa tu bandeja de entrada y sigue las instrucciones del correo. Si no lo encuentras, revisa la carpeta de spam.</p>
        </div>

        <button class="btn btn-secondary" id="resend-email-btn" (click)="resend()">
          Reenviar correo
        </button>

        <a routerLink="/auth/login" class="btn btn-primary" id="back-to-login-btn">
          Volver al Login
        </a>
      </div>
    </div>
  `,
  styleUrl: '../auth-shared.css',
})
export class EmailSent {
  private route = inject(ActivatedRoute);
  email = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe((p) => (this.email = p['email'] ?? ''));
  }

  resend(): void {
    // Mock resend
    alert('Correo reenviado exitosamente');
  }
}
