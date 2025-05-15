package com.uisstore.cart_service_backend.service;

import com.uisstore.cart_service_backend.model.Cart;
import com.uisstore.cart_service_backend.model.CartItem;
import com.uisstore.cart_service_backend.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor // Lombok: crea un constructor con los campos final requeridos
public class CartService {

    private final CartRepository cartRepository;

    public Cart getCart(String cartId) {
        return cartRepository.findById(cartId).orElse(new Cart(cartId)); // Crea uno nuevo si no existe
    }

    public Cart addItemToCart(String cartId, CartItem item) {
        Cart cart = getCart(cartId);
        cart.addItem(item); // La lógica de si es nuevo o actualiza cantidad está en Cart.addItem
        return cartRepository.save(cart);
    }

    public Cart updateItemQuantity(String cartId, String productId, int quantity) {
        Cart cart = getCart(cartId);
        cart.updateItemQuantity(productId, quantity);
        return cartRepository.save(cart);
    }

    public Cart removeItemFromCart(String cartId, String productId) {
        Cart cart = getCart(cartId);
        cart.removeItem(productId);
        return cartRepository.save(cart);
    }

    public Cart clearCart(String cartId) {
        Cart cart = getCart(cartId);
        cart.clearCart();
        return cartRepository.save(cart);
    }

    public void deleteCart(String cartId) { // Útil si el carrito se convierte a orden o el usuario lo elimina
        cartRepository.deleteById(cartId);
    }
}