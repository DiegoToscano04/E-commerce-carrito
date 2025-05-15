import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Importar RouterLink
import { CartListComponent } from './cart-list/cart-list.component';
import { CartSummaryComponent } from './cart-summary/cart-summary.component';
import { CartEmptyComponent } from './cart-empty/cart-empty.component';
import { CartService } from './cart.service';
import { CartItemRequest } from './models/cart-item.model'; // Asegúrate de importar esto
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http'; // Importar HttpClient

@Component({
  selector: 'app-root-carrito', // O el selector que estés usando
  standalone: true,
  imports: [
    CommonModule,
    RouterLink, // Añadir RouterLink a los imports
    CartListComponent,
    CartSummaryComponent,
    CartEmptyComponent,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  providers: [CartService],
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private testHttp = inject(HttpClient, { optional: true });
  title = 'carrito-mfe';
  public cartService = inject(CartService);

  constructor() {
     console.log('AppComponent (carrito) - HttpClient inyectado correctamente', this.testHttp);
    // Opcional: Si quieres asegurarte que el carrito se carga al iniciar el MFE,
    // aunque el servicio ya lo hace en su constructor.
    // Podrías añadir una llamada explícita si fuera necesario por alguna razón de ciclo de vida.
    // this.cartService.loadCartFromServer();
  }

  handleClearCart(): void {
    // Podrías añadir una confirmación aquí si lo deseas
    if (confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
      this.cartService.clearCart();
    }
  }

  // Método de prueba para añadir un item (puedes eliminarlo después)
  addTestItem(): void {
    const uniqueProductId = 'TEST_P' + Date.now().toString().slice(-4); // Un ID de producto un poco más único para pruebas
    const testItem: CartItemRequest = {
      productId: uniqueProductId,
      productName: `Producto Test ${uniqueProductId}`,
      imageUrl: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png',
      price: parseFloat((Math.random() * 50000 + 10000).toFixed(0)), // Precio aleatorio entre 10000 y 60000
      quantity: 1
    };
    console.log('Añadiendo item de prueba:', testItem);
    this.cartService.addItem(testItem).then(() => {
      console.log('Item de prueba añadido (o intento realizado)');
    }).catch(err => {
      console.error('Error al añadir item de prueba:', err);
    });
  }
}