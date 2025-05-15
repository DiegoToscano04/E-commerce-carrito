package com.uisstore.cart_service_backend.dto;

import lombok.Data;

@Data
public class AddItemRequest {
    private String productId;
    private String productName;
    private String imageUrl;
    private Double price;
    private Integer quantity;
}