package com.uisstore.cart_service_backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@RedisHash("Cart") // Esto le dice a Spring Data Redis que esta entidad se mapea a un hash en Redis con el prefijo "Cart"
public class Cart implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id // Identificador único del carrito (podría ser un UUID generado por el cliente o un userId)
    private String id;
    private List<CartItem> items = new ArrayList<>();
    // Podríamos añadir campos como userId si ya tuviéramos autenticación

    public Cart(String id) {
        this.id = id;
    }

    // Métodos útiles (se pueden mover al servicio si se prefiere una lógica más centralizada)
    public void addItem(CartItem item) {
        for (CartItem existingItem : items) {
            if (existingItem.getProductId().equals(item.getProductId())) {
                existingItem.setQuantity(existingItem.getQuantity() + item.getQuantity());
                return;
            }
        }
        items.add(item);
    }

    public void removeItem(String productId) {
        items.removeIf(item -> item.getProductId().equals(productId));
    }

    public void updateItemQuantity(String productId, int quantity) {
        for (CartItem item : items) {
            if (item.getProductId().equals(productId)) {
                if (quantity <= 0) {
                    removeItem(productId);
                } else {
                    item.setQuantity(quantity);
                }
                return;
            }
        }
    }

    public void clearCart() {
        this.items.clear();
    }

    public double getTotal() {
        return items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }
}