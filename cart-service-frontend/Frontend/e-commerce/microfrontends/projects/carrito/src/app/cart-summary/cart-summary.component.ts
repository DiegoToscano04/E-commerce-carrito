import { Component, inject, ChangeDetectionStrategy } from '@angular/core'; // Añadir ChangeDetectionStrategy
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../cart.service';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule, 
    CurrencyPipe,
    HttpClientModule],
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // ¡Importante con Signals!
})
export class CartSummaryComponent {
  public cartService = inject(CartService);

  applyCoupon(): void {
    // TODO: Implementar lógica para aplicar cupón.
    // Esto podría implicar mostrar un input para el código del cupón,
    // llamar a un endpoint del backend (quizás al servicio de Descuentos vía Carrito o Kong),
    // y luego actualizar el carrito si el cupón es válido.
    console.log('Aplicar cupón clickeado');
    alert('Funcionalidad de cupón pendiente de implementación.');
  }

  proceedToCheckout(): void {
    // TODO: Implementar lógica para proceder al pago.
    // Esto implicará:
    // 1. Quizás una última validación del carrito.
    // 2. Llamar a un método en CartService (ej. `cartService.checkout()`)
    //    que a su vez llamará a un endpoint del backend (ej. POST /api/v1/cart/{cartId}/checkout).
    // 3. El backend publicará un evento en RabbitMQ.
    // 4. El frontend podría navegar a una página de confirmación o al microfrontend de Pagos.
    console.log('Proceder al pago clickeado');
    if (this.cartService.isEmpty()) {
      alert('Tu carrito está vacío.');
      return;
    }
    alert('Funcionalidad de proceder al pago pendiente de implementación (conexión con RabbitMQ y Órdenes).');
    // Ejemplo de cómo podría ser:
    // this.cartService.initiateCheckout().then(() => {
    //   // Navegar a la página de pagos/confirmación
    // }).catch(err => {
    //   // Mostrar error
    // });
  }
}