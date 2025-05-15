import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // Asegurar CurrencyPipe
import { CartItem } from '../models/cart-item.model'; // Modelo frontend
import { CartService } from '../cart.service';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-cart-list',
  standalone: true,
  imports: [CommonModule,
     CurrencyPipe,
     HttpClientModule
    ],
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartListComponent {
  public cartService = inject(CartService); // Inyectamos el servicio

  // Los métodos ahora llaman a los métodos del servicio que interactúan con el backend.
  // Ya no son síncronos porque el servicio maneja la asincronía.
  // El componente no necesita preocuparse por async/await aquí si solo dispara la acción.

  increment(item: CartItem): void {
    // El servicio ya tiene la lógica para encontrar el item y actualizarlo
    this.cartService.incrementQuantity(item.productId);
  }

  decrement(item: CartItem): void {
    // El servicio maneja la lógica de no bajar de 1 o eliminar si llega a 0
    this.cartService.decrementQuantity(item.productId);
  }

  remove(item: CartItem): void {
    this.cartService.removeItem(item.productId);
  }

  // trackBy para mejorar rendimiento del *ngFor. Usamos productId
  trackByProductId(index: number, item: CartItem): string {
    return item.productId;
  }
}