# Etapa 1: Compilación de la aplicación con Maven
# Usaremos una imagen de Maven que ya tiene JDK para compilar nuestro proyecto.
FROM maven:3.8.5-openjdk-17 AS build
# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app
# Copiar solo el pom.xml primero para aprovechar el cache de capas de Docker
COPY pom.xml .
# Descargar todas las dependencias (esto también se cacheará si pom.xml no cambia)
RUN mvn dependency:go-offline
# Copiar el resto del código fuente de la aplicación
COPY src ./src
# Compilar la aplicación y empaquetarla en un JAR. Saltamos los tests para una construcción más rápida de la imagen.
RUN mvn package -DskipTests

# Etapa 2: Creación de la imagen final de ejecución
# Usaremos una imagen base de OpenJDK más ligera, solo con el JRE necesario para ejecutar.
FROM openjdk:17-jdk-slim
# Establecer el directorio de trabajo
WORKDIR /app
# Copiar el JAR compilado desde la etapa de 'build' a la imagen final
# La ruta al JAR será target/NOMBRE_DEL_ARTEFACTO-VERSION.jar.
# Reemplaza 'cart-service-backend-0.0.1-SNAPSHOT.jar' con el nombre exacto de tu JAR generado.
# Puedes encontrar el nombre en la carpeta 'target' después de un 'mvn package'.
COPY --from=build /app/target/cart-service-backend-0.0.1-SNAPSHOT.jar app.jar
# Exponer el puerto en el que corre la aplicación Spring Boot (por defecto 8080)
EXPOSE 8080
# Comando para ejecutar la aplicación cuando el contenedor inicie
ENTRYPOINT ["java", "-jar", "app.jar"]