# Etapa 1: Construir la aplicación Angular Shell
FROM node:18-alpine AS build
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .

# ---- Construir los proyectos ----
RUN echo "Iniciando build de SHELL..."
RUN npx ng build shell --configuration=production
RUN echo "Build de SHELL completado."

RUN echo "Iniciando build de CARRITO..."
RUN npx ng build carrito --configuration=production
RUN echo "Build de CARRITO completado."

# ---- Comandos de Depuración DETALLADOS ----
RUN echo "================ CONTENIDO DE /app/dist (RAÍZ DE DIST) ================"
RUN ls -R /app/dist || echo "/app/dist no encontrado o vacío"
# Si /app/dist/shell existe, lista su contenido
RUN if [ -d "/app/dist/shell" ]; then echo "================ CONTENIDO DE /app/dist/shell ================"; ls -R /app/dist/shell; fi
# Si /app/dist/carrito existe, lista su contenido
RUN if [ -d "/app/dist/carrito" ]; then echo "================ CONTENIDO DE /app/dist/carrito ================"; ls -R /app/dist/carrito; fi
RUN echo "================ FIN DE LISTADOS DE DEPURACIÓN ================"

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# --- Copiar los artefactos construidos del Shell ---
# QUITA '/browser/' DE LA RUTA
COPY --from=build /app/dist/shell/ /usr/share/nginx/html/

# --- Copiar los artefactos construidos del MFE Carrito ---
RUN mkdir -p /usr/share/nginx/html/carrito-mfe
# QUITA '/browser/' DE LA RUTA
COPY --from=build /app/dist/carrito/ /usr/share/nginx/html/carrito-mfe/

COPY projects/shell/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80