package com.uisstore.cart_service_backend.controller;

import com.uisstore.cart_service_backend.dto.AddItemRequest; // Crearemos este DTO
import com.uisstore.cart_service_backend.dto.UpdateQuantityRequest; // Crearemos este DTO
import com.uisstore.cart_service_backend.model.Cart;
import com.uisstore.cart_service_backend.model.CartItem;
import com.uisstore.cart_service_backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart") // Ruta base para el carrito
@RequiredArgsConstructor
// @CrossOrigin(origins = "*") // Temporalmente para desarrollo local con Angular. Mejor configurar globalmente o con Kong.
public class CartController {

    private final CartService cartService;

    // Obtener el carrito
    @GetMapping("/{cartId}")
    public ResponseEntity<Cart> getCart(@PathVariable String cartId) {
        return ResponseEntity.ok(cartService.getCart(cartId));
    }

    // Añadir un ítem al carrito
    // Necesitamos un DTO para el cuerpo de la petición
    @PostMapping("/{cartId}/items")
    public ResponseEntity<Cart> addItem(@PathVariable String cartId, @RequestBody AddItemRequest addItemRequest) {
        CartItem newItem = new CartItem(
                addItemRequest.getProductId(),
                addItemRequest.getProductName(),
                addItemRequest.getImageUrl(),
                addItemRequest.getPrice(),
                addItemRequest.getQuantity()
        );
        return ResponseEntity.ok(cartService.addItemToCart(cartId, newItem));
    }

    // Actualizar cantidad de un ítem
    @PutMapping("/{cartId}/items/{productId}")
    public ResponseEntity<Cart> updateItemQuantity(@PathVariable String cartId,
                                                   @PathVariable String productId,
                                                   @RequestBody UpdateQuantityRequest updateQuantityRequest) {
        return ResponseEntity.ok(cartService.updateItemQuantity(cartId, productId, updateQuantityRequest.getQuantity()));
    }

    // Eliminar un ítem del carrito
    @DeleteMapping("/{cartId}/items/{productId}")
    public ResponseEntity<Cart> removeItem(@PathVariable String cartId, @PathVariable String productId) {
        return ResponseEntity.ok(cartService.removeItemFromCart(cartId, productId));
    }

    // Vaciar el carrito
    @DeleteMapping("/{cartId}")
    public ResponseEntity<Cart> clearCart(@PathVariable String cartId) {
        return ResponseEntity.ok(cartService.clearCart(cartId));
    }
}