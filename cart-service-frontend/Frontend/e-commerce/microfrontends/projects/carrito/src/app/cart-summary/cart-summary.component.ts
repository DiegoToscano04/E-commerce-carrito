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

    async proceedToCheckout(): Promise<void> {
    if (this.cartService.isEmpty()) {
      // Este chequeo ya lo hace el servicio, pero es bueno tenerlo aquí también
      // para feedback inmediato en la UI si es necesario.
      alert('Tu carrito está vacío.');
      return;
    }

    // El servicio ya maneja isLoading, pero podemos añadir un estado local si queremos
    // un control más granular en este componente específico durante el checkout.
    // Por ahora, confiamos en el isLoading global del servicio.

    const success = await this.cartService.initiateCheckout();

    if (success) {
      alert('¡Proceso de pago iniciado! Serás redirigido en breve.'); // Placeholder
      // Aquí es donde, en un futuro, podrías:
      // 1. Esperar una señal/evento del backend (vía WebSockets, por ejemplo) de que la orden fue creada.
      // 2. O simplemente navegar a una página de "Gracias por tu pedido" o al microfrontend de Pagos.
      //    Ejemplo: this.router.navigate(['/pagos']); // (si '/pagos' es la ruta al MFE de pagos)

      // IMPORTANTE: Como decidimos NO vaciar el carrito en el frontend inmediatamente en el servicio,
      // el carrito seguirá visible. Esto es generalmente bueno.
      // El microservicio de Órdenes, al procesar el evento de RabbitMQ, podría eventualmente
      // enviar otro evento o tener un API para que el carrito se marque como "completado" o se vacíe.
    } else {
      // El CartService ya debería haber puesto un mensaje en cartService.error()
      // pero podemos mostrar un alert genérico aquí también.
      // No es necesario si ya muestras cartService.error() en la plantilla.
      if (!this.cartService.error()) { // Solo mostrar si el servicio no puso un error más específico
        alert('Hubo un problema al iniciar el proceso de pago. Por favor, inténtalo de nuevo.');
      }
    }
  }
}