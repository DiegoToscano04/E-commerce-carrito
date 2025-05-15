package com.uisstore.cart_service_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable; // Importante para Redis

@Data // Lombok: genera getters, setters, toString, equals, hashCode
@NoArgsConstructor
@AllArgsConstructor
public class CartItem implements Serializable { // Serializable para que Redis pueda almacenarlo
    private static final long serialVersionUID = 1L; // Buena práctica para Serializable

    private String productId;
    private String productName;
    private String imageUrl; // Para mostrar en el carrito
    private Double price;
    private Integer quantity;
    // No necesitamos subtotal aquí, se calculará dinámicamente
}