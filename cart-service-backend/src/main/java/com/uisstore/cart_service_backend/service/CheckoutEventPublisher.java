package com.uisstore.cart_service_backend.service;

import com.uisstore.cart_service_backend.config.RabbitMQConfig; // Para acceder a EXCHANGE_NAME y ROUTING_KEY
import com.uisstore.cart_service_backend.dto.CheckoutEvent; // El DTO del evento
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Para logging
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor // Lombok para inyectar RabbitTemplate
@Slf4j // Lombok para logging fácil con 'log'
public class CheckoutEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishCheckoutEvent(CheckoutEvent event) {
        try {
            log.info("Publicando CheckoutEvent con cartId: {} y eventId: {}", event.getCartId(), event.getEventId());
            // Enviamos el evento al exchange configurado con la routing key específica.
            // RabbitTemplate usará el MessageConverter (Jackson2JsonMessageConverter) que configuramos
            // para serializar el objeto 'event' a JSON.
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY, event);
            log.info("CheckoutEvent publicado exitosamente para cartId: {}", event.getCartId());
        } catch (Exception e) {
            log.error("Error al publicar CheckoutEvent para cartId: {}. Error: {}", event.getCartId(), e.getMessage(), e);
            // Aquí podrías considerar una estrategia de reintento o enviar a una dead-letter queue (DLQ)
            // si la publicación falla persistentemente, pero por ahora solo logueamos el error.
        }
    }
}