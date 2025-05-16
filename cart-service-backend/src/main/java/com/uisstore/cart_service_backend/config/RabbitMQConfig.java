package com.uisstore.cart_service_backend.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // --- Nombre para nuestros exchanges y queues ---
    // Usaremos un exchange de tipo "direct" para este evento específico.
    // El servicio de Órdenes se suscribirá a una cola vinculada a este exchange con una routing key.
    public static final String EXCHANGE_NAME = "checkout_exchange";
    public static final String QUEUE_NAME = "checkout_queue_orders"; // La cola que consumirá el servicio de Órdenes
    public static final String ROUTING_KEY = "checkout.initiated";

    // --- Declaración del Exchange ---
    @Bean
    public DirectExchange checkoutExchange() {
        return new DirectExchange(EXCHANGE_NAME);
    }

    // --- Declaración de la Queue (donde el servicio de Órdenes escuchará) ---
    // Esta declaración es para que el publicador (servicio de carrito) sepa que existe.
    // El consumidor (servicio de órdenes) también la declarará para asegurarse de que se cree
    // y para empezar a consumir de ella. Es idempotente, si ya existe, no hace nada.
    @Bean
    public Queue checkoutQueue() {
        // El segundo argumento 'durable' (true) significa que la cola sobrevivirá a reinicios del broker RabbitMQ.
        return new Queue(QUEUE_NAME, true);
    }

    // --- Declaración del Binding (vincular la queue al exchange con una routing key) ---
    @Bean
    public Binding binding(Queue checkoutQueue, DirectExchange checkoutExchange) {
        return BindingBuilder.bind(checkoutQueue).to(checkoutExchange).with(ROUTING_KEY);
    }

    // --- Message Converter (para serializar/deserializar objetos a JSON) ---
    // Esto es crucial para enviar nuestros objetos Java (como CheckoutEvent) como JSON.
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // --- RabbitTemplate configuración (opcional pero recomendado) ---
    // Configuramos el RabbitTemplate para que use nuestro MessageConverter.
    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}