#!/bin/bash

# Script para configurar Kong API Gateway para el servicio de carrito
# Asegúrate de que KONG_ADMIN_URL esté configurado para apuntar a tu API de Admin de Kong

# --- Variables de Configuración ---
# Cambia estas variables si tus puertos o IPs son diferentes en el servidor
KONG_ADMIN_IP="10.6.101.125" # IP del servidor donde corre Kong
KONG_ADMIN_PORT="8089"      # Puerto del host mapeado a la API de Admin de Kong (8001 del contenedor)

KONG_ADMIN_URL="http://${KONG_ADMIN_IP}:${KONG_ADMIN_PORT}"

SERVICE_NAME="cart-service-upstream"
ROUTE_NAME="cart-api-route-external" # Usar un nombre diferente o el mismo 
ROUTE_PATH="/cart-api" # Path público en Kong para acceder al servicio de carrito

# --- Funciones ---
function check_command {
  if [ $? -ne 0 ]; then
    echo "Error: El comando anterior falló. Saliendo."
    exit 1
  fi
}

echo "--- Configurando Kong API Gateway en ${KONG_ADMIN_URL} ---"

# 1. Crear el Service en Kong
echo ""
echo "Paso 1: Creando el Service '${SERVICE_NAME}'..."
curl -i -X POST \
  --url "${KONG_ADMIN_URL}/services/" \
  --header 'Content-Type: application/json' \
  --data @- << EOF # Usamos un 'here document' para el JSON
{
    "name": "${SERVICE_NAME}",
    "protocol": "http",
    "host": "cart-service",
    "port": 8080
}
EOF
check_command

# 2. Crear la Route para el Service
echo ""
echo "Paso 2: Creando la Route '${ROUTE_NAME}' para el Service '${SERVICE_NAME}'..."
curl -i -X POST \
  --url "${KONG_ADMIN_URL}/services/${SERVICE_NAME}/routes" \
  --header 'Content-Type: application/json' \
  --data @- << EOF
{
    "name": "${ROUTE_NAME}",
    "protocols": ["http", "https"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "paths": ["${ROUTE_PATH}"],
    "strip_path": true
}
EOF
check_command

echo ""
echo "--- Configuración de Kong completada exitosamente ---"
echo "Tu servicio de carrito debería ser accesible a través de Kong en: http://${KONG_ADMIN_IP}:<KONG_PROXY_PORT>${ROUTE_PATH}/api/v1/cart/..."
echo "(Reemplaza <KONG_PROXY_PORT> con el puerto del proxy de Kong, ej. 8088)"

exit 0
