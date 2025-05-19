// projects/carrito/src/app/cart.service.ts
import { Injectable, computed, signal, effect, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Cart } from './models/cart.model'; // Frontend Cart model
import { CartItem, CartItemRequest } from './models/cart-item.model'; // Frontend CartItem model y Request DTO

// Interfaz para el item tal como viene del backend (antes del mapeo)
interface BackendCartItem {
  productId: string;
  productName: string; // Difiere de nuestro 'name'
  imageUrl: string;    // Difiere de nuestro 'image'
  price: number;
  quantity: number;
}

// Interfaz para el carrito tal como viene del backend
interface BackendCart {
  id: string;
  items: BackendCartItem[];
  total?: number; // El backend no lo envía actualmente por defecto, pero podría
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  //private apiUrl = 'http://localhost:8080/api/v1/cart'; // URL de tu backend Spring Boot
  //private apiUrl = 'http://localhost:8088/cart-api/api/v1/cart'; // NUEVA URL a través de Kong
  private apiUrl = 'http://10.6.101.125:8088/cart-api/api/v1/cart';// Kong con la ip del server de la U.
  private cartIdKey = 'uisShopCartId_v1'; // Clave para localStorage (añade versión por si cambias la estructura)

  // --- Signals para el estado del carrito ---
  private cartState = signal<Cart | null>(null); // Estado completo del carrito (mapeado)
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // --- Signals computados para fácil acceso desde componentes ---
  // Estos ya los tenías, ¡genial! Solo los adaptamos para usar cartState
  public cartItems = computed<CartItem[]>(() => this.cartState()?.items || []);
  public totalItems = computed<number>(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  public totalPrice = computed<number>(() =>
    this.cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
  public isEmpty = computed<boolean>(() => this.totalItems() === 0);


  constructor() {
    this.loadCartFromServer(); // Cargar el carrito al iniciar el servicio

    // Opcional: Efecto para depuración o reaccionar a cambios en el carrito
    // effect(() => {
    //   console.log('Cart state changed:', this.cartState());
    // });
  }

  // --- Gestión del cartId ---
  private getCartId(): string {
    if (typeof localStorage === 'undefined') {
      // Manejo para SSR o entornos sin localStorage (podría devolver un ID temporal o error)
      // Por ahora, para simplificar, asumimos que localStorage está disponible en el cliente
      // O generamos uno que no se persistirá si estamos en el servidor
      console.warn('localStorage no disponible. Generando cartId temporal.');
      return crypto.randomUUID(); // Necesitarás polyfill o alternativa si apuntas a navegadores muy viejos
    }

    let cartId = localStorage.getItem(this.cartIdKey);
    if (!cartId) {
      //cartId = crypto.randomUUID(); // Genera un UUID
      cartId = uuidv4(); // <--- USAR uuidv4() EN LUGAR DE crypto.randomUUID()
      localStorage.setItem(this.cartIdKey, cartId);
    }
    return cartId;
  }

  // --- Mapeo de datos Backend -> Frontend ---
  private mapBackendCartItemToFrontend(backendItem: BackendCartItem): CartItem {
    return {
      productId: backendItem.productId,
      name: backendItem.productName, // Mapeo
      image: backendItem.imageUrl,   // Mapeo
      price: backendItem.price,
      quantity: backendItem.quantity,
      // color y size no vienen del backend actual, se podrían manejar si se añaden
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
    const currentCartId = this.getCartId();
    try {
      const backendCart = await this.http.get<BackendCart>(`${this.apiUrl}/${currentCartId}`).toPromise();
      if (backendCart) {
        this.cartState.set(this.mapBackendCartToFrontend(backendCart));
      } else {
        // Si el backend devuelve null o undefined (aunque no debería con orElse(new Cart(cartId)))
        this.cartState.set({ id: currentCartId, items: [] });
      }
    } catch (err) {
      this.handleHttpError(err, 'Error al cargar el carrito');
      // Incluso si hay error, podríamos inicializar un carrito local vacío
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
    if (newQuantity <= 0) { // Si la cantidad es 0 o menos, eliminamos el item
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

  // --- Métodos de conveniencia (usados por cart-list.component) ---
  // Estos métodos ahora llaman a updateItemQuantity

  public incrementQuantity(productId: string): void {
    const item = this.cartItems().find(i => i.productId === productId);
    if (item) {
      this.updateItemQuantity(productId, item.quantity + 1);
    }
  }

  public decrementQuantity(productId: string): void {
    const item = this.cartItems().find(i => i.productId === productId);
    if (item && item.quantity > 1) { // La lógica de no bajar de 1 antes de llamar al backend
      this.updateItemQuantity(productId, item.quantity - 1);
    } else if (item && item.quantity === 1) {
      // Si la cantidad es 1 y se decrementa, se elimina el producto
      this.removeItem(productId);
    }
  }


  // --- Manejo de errores HTTP ---
  private handleHttpError(error: any, defaultMessage: string): void {
    let errorMessage = defaultMessage;
    if (error instanceof HttpErrorResponse) {
      // El backend puede devolver un mensaje de error más específico
      if (error.error && typeof error.error.message === 'string') {
        errorMessage = error.error.message;
      } else if (typeof error.message === 'string') {
        errorMessage = error.message;
      }
    }
    console.error(error); // Loguear el error completo para depuración
    this.error.set(errorMessage);
    this.isLoading.set(false); // Asegurarse de que isLoading se resetee en error
  }

  public async initiateCheckout(): Promise<boolean> { // Devuelve true si la llamada fue exitosa (2xx)
    if (this.isEmpty()) {
      console.warn('Intento de checkout con carrito vacío desde el frontend.');
      this.error.set('No puedes proceder al pago con un carrito vacío.');
      return false;
    }

    this.isLoading.set(true);
    this.error.set(null);
    const currentCartId = this.getCartId();

    try {
      // La llamada al backend es un POST al endpoint /{cartId}/checkout
      // No esperamos un cuerpo de respuesta significativo, solo un código de estado.
      // Usamos { observe: 'response' } para obtener la respuesta completa y verificar el estado.
      const response = await this.http.post<void>(`${this.apiUrl}/${currentCartId}/checkout`, null, { observe: 'response' }).toPromise();

      if (response && response.status >= 200 && response.status < 300) {
        console.log('Checkout iniciado exitosamente en el backend para cartId:', currentCartId);
        this.isLoading.set(false);

        // DECISIÓN IMPORTANTE: ¿Qué hacer con el carrito en el frontend después de un checkout exitoso?
        // Opción 1: Vaciarlo inmediatamente.
        // this.cartState.set({ id: currentCartId, items: [] });
        // localStorage.removeItem(this.cartIdKey); // Opcional: forzar la creación de un nuevo cartId la próxima vez
        // console.log('Carrito local vaciado y cartId de localStorage eliminado después del checkout.');

        // Opción 2: Dejarlo como está y que el servicio de Órdenes/Pagos
        // eventualmente confirme y luego se gestione la limpieza del carrito
        // (quizás a través de otro evento o una acción del usuario).
        // Esta es a menudo preferible para que el usuario aún vea su carrito
        // mientras se procesa el pago, o si el pago falla, el carrito sigue ahí.

        // Por ahora, adoptaremos la Opción 2 (no hacer nada inmediato con el estado local del carrito)
        // solo nos aseguramos de que isLoading se apague.
        // El backend podría, en un futuro, devolver el carrito actualizado (quizás vacío)
        // y podríamos usar esa respuesta para actualizar this.cartState.set(...).

        return true;
      } else {
        // Esto no debería ocurrir si el backend devuelve 200 o un error HTTP que catch maneja
        this.handleHttpError(response, 'Respuesta inesperada del servidor durante el checkout.');
        return false;
      }
    } catch (err) {
      this.handleHttpError(err, 'Error al iniciar el proceso de checkout.');
      return false;
    }
    // finally no es necesario aquí porque isLoading se maneja en try/catch
}
}
