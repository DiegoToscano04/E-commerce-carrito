// projects/carrito/src/app/models/cart.model.ts
import { CartItem } from './cart-item.model';

export interface Cart {
  id: string;          // El cartId (UUID generado por el cliente o userId)
  items: CartItem[];
  // Podríamos añadir un campo 'total' si el backend siempre lo calcula y lo devuelve.
  // Por ahora, el backend devuelve los items y calcularemos el total en el frontend
  // o lo obtendremos del backend si es necesario.
  // El backend ya tiene un método getTotal() en la entidad Cart, pero no lo expone
  // directamente en el JSON de respuesta por defecto. Podríamos añadirlo si queremos.
}