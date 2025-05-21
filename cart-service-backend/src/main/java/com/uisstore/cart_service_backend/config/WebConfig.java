package com.uisstore.cart_service_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            // En WebConfig.java del backend
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/v1/**")
                        // Opción 1: Permitir múltiples orígenes específicos
                        .allowedOrigins("http://localhost:4200", "http://localhost:4300", "http://172.174.245.137:4200", "http://10.6.101.125:4200")
                        // Opción 2: Permitir todos los orígenes (SOLO PARA DESARROLLO LOCAL)
                        // .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
