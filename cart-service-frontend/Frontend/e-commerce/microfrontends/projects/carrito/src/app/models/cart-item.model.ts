// projects/carrito/src/app/models/cart-item.model.ts
export interface CartItem {
  productId: string;    // Coincide con productId en CartItem.java y será el identificador principal
  name: string;         // Mantenemos 'name' para el frontend (tu HTML actual)
  image: string;        // Mantenemos 'image' para el frontend (tu HTML actual)
  price: number;        // Coincide con price en CartItem.java
  quantity: number;     // Coincide con quantity en CartItem.java
  color?: string;       // Opcional, como en tu HTML
  size?: string;        // Opcional, como en tu HTML
}

// DTO para las peticiones al backend (para añadir/actualizar items)
// Este DTO usará los nombres de campo que espera el backend
export interface CartItemRequest {
  productId: string;
  productName: string; // El backend espera productName
  imageUrl: string;    // El backend espera imageUrl
  price: number;
  quantity: number;
}