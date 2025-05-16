package com.uisstore.cart_service_backend.dto;

import com.uisstore.cart_service_backend.model.CartItem; // Asegúrate de importar tu CartItem
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable; // Importante para la serialización
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutEvent implements Serializable { // Implementar Serializable es buena práctica para eventos
    private static final long serialVersionUID = 1L;

    private String eventId;         // Un ID único para este evento específico
    private String cartId;          // El ID del carrito que se está procesando
    // private String userId;       // Lo añadiremos cuando tengamos autenticación
    private List<CartItemData> items; // Usaremos un DTO interno para los items
    private double totalPrice;        // El precio total calculado en el momento del checkout
    private LocalDateTime timestamp;  // Cuándo ocurrió el evento

    // DTO interno para los items del carrito en el evento
    // Esto nos da flexibilidad para no enviar TODA la info de CartItem si no es necesaria
    // y para desacoplar el evento de la entidad CartItem del servicio de carrito.
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemData implements Serializable {
        private static final long serialVersionUID = 1L;
        private String productId;
        private String productName;
        // No enviaremos imageUrl al servicio de órdenes, probablemente no lo necesite para crear la orden.
        // private String imageUrl;
        private Double price;       // Precio unitario en el momento del checkout
        private Integer quantity;
    }
}