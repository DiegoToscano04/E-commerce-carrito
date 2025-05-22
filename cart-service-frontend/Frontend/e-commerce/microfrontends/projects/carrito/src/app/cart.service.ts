// projects/carrito/src/app/cart.service.ts
import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Cart } from './models/cart.model';
import { CartItem, CartItemRequest } from './models/cart-item.model';
import { v4 as uuidv4 } from 'uuid'; // <--- IMPORTANTE: Importar v4 de uuid

// Interfaz para el item tal como viene del backend (antes del mapeo)
interface BackendCartItem {
  productId: string;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

// Interfaz para el carrito tal como viene del backend
interface BackendCart {
  id: string;
  items: BackendCartItem[];
  total?: number;
}

@Injectable({
  // Si CartService se provee en AppComponent del carrito, esta línea no es estrictamente necesaria
  // pero no hace daño tenerla. Si solo se provee en AppComponent, puedes quitarla.
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  //private apiUrl = 'http://localhost:8080/api/v1/cart'; // URL de tu backend Spring Boot
  //private apiUrl = 'http://localhost:8088/cart-api/api/v1/cart'; // NUEVA URL a través de Kong
  private apiUrl = 'http://10.6.101.125:8088/cart-api/api/v1/cart';// Kong con la ip del server de la U.
  //private apiUrl = 'http://172.174.245.137:8088/cart-api/api/v1/cart';// Kong con la ip del server de azure
  private cartIdKey = 'uisShopCartId_v1';

  private cartState = signal<Cart | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  public cartItems = computed<CartItem[]>(() => this.cartState()?.items || []);
  public totalItems = computed<number>(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  public totalPrice = computed<number>(() =>
    this.cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
  public isEmpty = computed<boolean>(() => this.totalItems() === 0);

  constructor() {
    // Carga el carrito DESPUÉS de asegurarte que la apiUrl está definida con la IP correcta.
    // Si apiUrl depende de una variable de entorno que se carga asíncronamente,
    // esta llamada podría necesitar ser diferida o re-invocada.
    // Por ahora, con la URL hardcodeada, esto está bien.
    this.loadCartFromServer();
  }

  // --- Gestión del cartId ---
  private getCartId(): string {
    // Primero, verifica si estamos en un entorno de navegador que tiene localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      let cartId = localStorage.getItem(this.cartIdKey);
      if (!cartId) {
        cartId = uuidv4(); // <--- CAMBIO: Usar uuidv4() para generar el UUID
        localStorage.setItem(this.cartIdKey, cartId);
      }
      return cartId;
    } else {
      // Entorno sin localStorage (ej. SSR en el servidor, o un test sin mock de localStorage)
      // Devolver un UUID temporal que no se persistirá.
      console.warn('localStorage no disponible. Generando cartId temporal para esta sesión.');
      return uuidv4(); // <--- CAMBIO: Usar uuidv4() también aquí
    }
  }

  // --- Mapeo de datos Backend -> Frontend ---
  private mapBackendCartItemToFrontend(backendItem: BackendCartItem): CartItem {
    return {
      productId: backendItem.productId,
      name: backendItem.productName,
      image: backendItem.imageUrl,
      price: backendItem.price,
      quantity: backendItem.quantity,
    };
  }

  private mapBackendCartToFrontend(backendCart: BackendCart): Cart {
    return {
      id: backendCart.id,
      items: backendCart.items.map(this.mapBackendCartItemToFrontend),
    };
  }

  // --- Métodos para interactuar con el Backend ---
  public async loadCartFromServer(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    const currentCartId = this.getCartId(); // Esto ahora usa uuidv4() si es necesario
    try {
      const backendCart = await this.http.get<BackendCart>(`${this.apiUrl}/${currentCartId}`).toPromise();
      if (backendCart) {
        this.cartState.set(this.mapBackendCartToFrontend(backendCart));
      } else {
        this.cartState.set({ id: currentCartId, items: [] });
      }
    } catch (err) {
      this.handleHttpError(err, 'Error al cargar el carrito');
      this.cartState.set({ id: currentCartId, items: [] });
    } finally {
      this.isLoading.set(false);
    }
  }

  public async addItem(itemRequest: CartItemRequest): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    const currentCartId = this.getCartId();
    try {
      const backendCart = await this.http.post<BackendCart>(`${this.apiUrl}/${currentCartId}/items`, itemRequest).toPromise();
      if (backendCart) {
        this.cartState.set(this.mapBackendCartToFrontend(backendCart));
      }
    } catch (err) {
      this.handleHttpError(err, 'Error al añadir el producto al carrito');
    } finally {
      this.isLoading.set(false);
    }
  }

  public async updateItemQuantity(productId: string, newQuantity: number): Promise<void> {
    if (newQuantity <= 0) {
      await this.removeItem(productId);
      return;
    }
    this.isLoading.set(true);
    this.error.set(null);
    const currentCartId = this.getCartId();
    try {
      const backendCart = await this.http.put<BackendCart>(`${this.apiUrl}/${currentCartId}/items/${productId}`, { quantity: newQuantity }).toPromise();
      if (backendCart) {
        this.cartState.set(this.mapBackendCartToFrontend(backendCart));
      }
    } catch (err) {
      this.handleHttpError(err, 'Error al actualizar la cantidad del producto');
    } finally {
      this.isLoading.set(false);
    }
  }

  public async removeItem(productId: string): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    const currentCartId = this.getCartId();
    try {
      const backendCart = await this.http.delete<BackendCart>(`${this.apiUrl}/${currentCartId}/items/${productId}`).toPromise();
      if (backendCart) {
        this.cartState.set(this.mapBackendCartToFrontend(backendCart));
      }
    } catch (err) {
      this.handleHttpError(err, 'Error al eliminar el producto del carrito');
    } finally {
      this.isLoading.set(false);
    }
  }

  public async clearCart(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    const currentCartId = this.getCartId();
    try {
      const backendCart = await this.http.delete<BackendCart>(`${this.apiUrl}/${currentCartId}`).toPromise();
      if (backendCart) {
        this.cartState.set(this.mapBackendCartToFrontend(backendCart));
      }
    } catch (err) {
      this.handleHttpError(err, 'Error al vaciar el carrito');
    } finally {
      this.isLoading.set(false);
    }
  }

  public incrementQuantity(productId: string): void {
    const item = this.cartItems().find(i => i.productId === productId);
    if (item) {
      this.updateItemQuantity(productId, item.quantity + 1);
    }
  }

  public decrementQuantity(productId: string): void {
    const item = this.cartItems().find(i => i.productId === productId);
    if (item && item.quantity > 1) {
      this.updateItemQuantity(productId, item.quantity - 1);
    } else if (item && item.quantity === 1) {
      this.removeItem(productId);
    }
  }

  private handleHttpError(error: any, defaultMessage: string): void {
    let errorMessage = defaultMessage;
    if (error instanceof HttpErrorResponse) {
      if (error.error && typeof error.error.message === 'string') {
        errorMessage = error.error.message;
      } else if (typeof error.message === 'string') {
        errorMessage = error.message;
      }
    }
    console.error(`${defaultMessage}. Raw error:`, error);
    this.error.set(errorMessage);
    this.isLoading.set(false);
  }

  public async initiateCheckout(): Promise<boolean> {
    if (this.isEmpty()) {
      console.warn('Intento de checkout con carrito vacío desde el frontend.');
      this.error.set('No puedes proceder al pago con un carrito vacío.');
      return false;
    }
    this.isLoading.set(true);
    this.error.set(null);
    const currentCartId = this.getCartId();
    try {
      const response = await this.http.post<void>(`${this.apiUrl}/${currentCartId}/checkout`, null, { observe: 'response' }).toPromise();
      if (response && response.status >= 200 && response.status < 300) {
        console.log('Checkout iniciado exitosamente en el backend para cartId:', currentCartId);
        this.isLoading.set(false);
        return true;
      } else {
        this.handleHttpError(response, 'Respuesta inesperada del servidor durante el checkout.');
        return false;
      }
    } catch (err) {
      this.handleHttpError(err, 'Error al iniciar el proceso de checkout.');
      return false;
    }
  }
}
