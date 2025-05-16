package com.uisstore.cart_service_backend.service;
import com.uisstore.cart_service_backend.dto.CheckoutEvent;
import com.uisstore.cart_service_backend.model.Cart;
import com.uisstore.cart_service_backend.model.CartItem;
import com.uisstore.cart_service_backend.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor // Lombok: crea un constructor con los campos final requeridos
@Slf4j
public class CartService {

    private final CheckoutEventPublisher eventPublisher;
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

    // Nuevo metodo para manejar el proceso de checkout
    public boolean initiateCheckout(String cartId) {
        Cart cart = getCart(cartId); // Obtener el carrito actual
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            // No se puede proceder al checkout con un carrito vacío
            // Podrías lanzar una excepción específica aquí si quieres
            log.warn("Intento de checkout con carrito vacío para cartId: {}", cartId);
            return false; // O lanzar una CartIsEmptyException
        }

        // 1. Crear el objeto CheckoutEvent
        List<CheckoutEvent.CartItemData> eventItems = cart.getItems().stream()
                .map(cartItem -> new CheckoutEvent.CartItemData(
                        cartItem.getProductId(),
                        cartItem.getProductName(), // Usamos productName de CartItem
                        cartItem.getPrice(),
                        cartItem.getQuantity()
                ))
                .collect(Collectors.toList());

        CheckoutEvent event = new CheckoutEvent(
                UUID.randomUUID().toString(), // Generar un eventId único
                cart.getId(),
                eventItems,
                cart.getTotal(), // Usamos el metodo getTotal() de la entidad Cart
                LocalDateTime.now()
        );


        // 2. Publicar el evento
        eventPublisher.publishCheckoutEvent(event);

        // 3. (Opcional) ¿Qué hacemos con el carrito en Redis después del checkout?
        //    Podríamos vaciarlo, marcarlo como "procesado", o simplemente dejarlo.
        //    Por ahora, lo dejaremos como está. Más adelante se podría decidir eliminarlo o
        //    asociarlo a una orden y luego limpiarlo.
        //    Si decides vaciarlo:
        //    clearCart(cartId);
        //    log.info("Carrito {} vaciado después de iniciar el checkout.", cartId);

        return true;
    }
}