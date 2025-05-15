import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

   // Contador de productos en el carrito
   cartCount: number = 0;

   // Función para agregar productos al carrito
   addToCart() {
     this.cartCount++;  // Aumenta el número de productos en el carrito
     this.updateCartCount();  // Actualiza el contador en la vista
   }
 
   // Función para actualizar el contador
   updateCartCount() {
     if (this.cartCount > 0) {
       // El contador será visible si hay productos en el carrito
       // No se necesita hacer nada aquí si ya estamos usando la interpolación en el HTML
     } else {
       // Si no hay productos, se ocultan los elementos del carrito
       this.cartCount = 0;
     }
   }

}
