package com.uisstore.cart_service_backend.repository;

import com.uisstore.cart_service_backend.model.Cart;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends CrudRepository<Cart, String> { // String es el tipo del @Id de Cart
    // Spring Data Redis generará las implementaciones CRUD básicas
}