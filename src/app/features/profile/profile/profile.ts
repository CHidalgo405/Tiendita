import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../../core/services/order.service';
import { UserService } from '../../../core/services/user.service';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <div class="profile-layout" id="profile-page">
      <!-- Green Header Background -->
      <div class="profile-header-bg">
        <div class="decor-circle decor-1"></div>
        <div class="decor-circle decor-2"></div>
        
        <div class="header-content">
          <div class="avatar-container">
            <div class="avatar-initials">{{ authService.user()?.firstName?.charAt(0) }}{{ authService.user()?.lastName?.charAt(0) }}</div>
            <div class="vip-badge" style="display: flex; align-items: center; gap: 4px;"><app-icon name="gem" size="12" fill="currentColor" /> VIP Familia</div>
          </div>
          <h2 class="user-name">{{ authService.user()?.firstName }} {{ authService.user()?.lastName }}</h2>
        </div>
        
        <!-- Curved bottom wave using SVG -->
        <svg class="header-wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 C480,120 960,120 1440,0 L1440,120 L0,120 Z" fill="var(--bg)"></path>
        </svg>
      </div>

      <div class="profile-content">
        <!-- Floating Stats Card -->
        <div class="stats-card">
          <div class="stat-item">
            <span class="stat-value">{{ orderService.getOrders().length }}</span>
            <span class="stat-label">Pedidos</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ userService.getAddresses().length }}</span>
            <span class="stat-label">Direcciones</span>
          </div>
        </div>

        <!-- Menu Container -->
        <div class="menu-container">
          <a routerLink="/orders/history" class="menu-item" id="menu-orders">
            <span class="menu-icon" style="display: flex; align-items: center;"><app-icon name="clipboard" size="18" /></span>
            <span class="menu-text">Mis Pedidos</span>
            <span class="menu-arrow">›</span>
          </a>
          <div class="menu-divider"></div>
          <a routerLink="/profile/addresses" class="menu-item" id="menu-addresses">
            <span class="menu-icon" style="display: flex; align-items: center;"><app-icon name="map-pin" size="18" /></span>
            <span class="menu-text">Mis Direcciones</span>
            <span class="menu-arrow">›</span>
          </a>
          <div class="menu-divider"></div>
          <a routerLink="/profile/payment-methods" class="menu-item" id="menu-payments">
            <span class="menu-icon" style="display: flex; align-items: center;"><app-icon name="credit-card" size="18" /></span>
            <span class="menu-text">Métodos de Pago</span>
            <span class="menu-arrow">›</span>
          </a>
          <div class="menu-divider"></div>
          <a routerLink="/profile/help" class="menu-item" id="menu-help">
            <span class="menu-icon" style="display: flex; align-items: center;"><app-icon name="help-circle" size="18" /></span>
            <span class="menu-text">Centro de Ayuda</span>
            <span class="menu-arrow">›</span>
          </a>
          <div class="menu-divider"></div>
          <a routerLink="/profile/terms" class="menu-item" id="menu-terms">
            <span class="menu-icon" style="display: flex; align-items: center;"><app-icon name="file-text" size="18" /></span>
            <span class="menu-text">Términos y Privacidad</span>
            <span class="menu-arrow">›</span>
          </a>
          @if (authService.user()?.role === 'admin') {
            <div class="menu-divider"></div>
            <a routerLink="/admin" class="menu-item" id="menu-admin" style="background-color: var(--primary-alpha); border-radius: 16px; margin: 6px 12px; transition: background 0.3s;">
              <span class="menu-icon" style="display: flex; align-items: center;"><app-icon name="shield" size="18" /></span>
              <span class="menu-text" style="color: var(--primary); font-weight: 800;">Panel de Administración</span>
              <span class="menu-arrow" style="color: var(--primary);">›</span>
            </a>
          }
        </div>

        <button class="logout-btn" (click)="authService.logout()" id="logout-btn">Cerrar Sesión</button>
      </div>
    </div>
  `,
  styles: [`
    .profile-layout {
      min-height: 100dvh;
      background-color: var(--bg);
      padding-bottom: 80px;
    }

    .profile-header-bg {
      position: relative;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      padding: 60px 24px 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    .decor-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
    }
    .decor-1 { width: 200px; height: 200px; top: -50px; right: -50px; }
    .decor-2 { width: 300px; height: 300px; bottom: -100px; left: -100px; }

    .header-wave {
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 40px;
      z-index: 1;
    }

    .header-content {
      position: relative;
      z-index: 2;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .avatar-container {
      position: relative;
      margin-bottom: 16px;
    }

    .avatar-initials {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: var(--surface);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 800;
      font-family: var(--font-heading);
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    }

    .vip-badge {
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--accent);
      color: #fff;
      font-size: 0.65rem;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 20px;
      white-space: nowrap;
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      border: 2px solid var(--primary);
    }

    .user-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #fff;
      margin: 0;
      font-family: var(--font-heading);
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .profile-content {
      padding: 0 24px;
      position: relative;
      z-index: 3;
      margin-top: -40px; /* Overlap with header */
    }

    .stats-card {
      background: var(--surface);
      border-radius: 24px;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      margin-bottom: 24px;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-primary);
      font-family: var(--font-heading);
    }

    .stat-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background-color: var(--border);
    }

    .menu-container {
      background: var(--surface);
      border-radius: 24px;
      padding: 8px 0;
      box-shadow: 0 4px 16px rgba(0,0,0,0.05);
      margin-bottom: 24px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      padding: 16px 24px;
      text-decoration: none;
      color: var(--text-primary);
      transition: background-color 0.2s;
    }

    .menu-item:hover {
      background-color: rgba(0,0,0,0.02);
    }

    .menu-icon {
      font-size: 1.3rem;
      margin-right: 16px;
      width: 24px;
      text-align: center;
    }

    .menu-text {
      flex: 1;
      font-size: 0.95rem;
      font-weight: 600;
    }

    .menu-arrow {
      font-size: 1.5rem;
      color: var(--text-muted);
      line-height: 1;
    }

    .menu-divider {
      height: 1px;
      background-color: var(--border);
      margin: 0 24px;
    }

    .logout-btn {
      display: block;
      width: 100%;
      padding: 16px;
      background: var(--surface);
      color: var(--danger);
      border: 1px solid var(--border);
      border-radius: 9999px;
      font-weight: 800;
      font-size: 0.95rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      transition: all 0.2s;
    }

    .logout-btn:hover {
      background: var(--danger-alpha);
      border-color: var(--danger);
      transform: translateY(-2px);
    }
  `],
})
export class Profile {
  protected authService = inject(AuthService);
  protected orderService = inject(OrderService);
  protected userService = inject(UserService);
}
