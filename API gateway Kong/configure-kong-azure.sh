#!/bin/bash

# Script para configurar Kong API Gateway para el servicio de carrito

# --- Variables de Configuración ---
KONG_ADMIN_IP="172.174.245.137"
KONG_ADMIN_PORT="8089"
KONG_PROXY_PORT="8088" # <--- AÑADIR ESTA VARIABLE
FRONTEND_ORIGIN_URL="http://172.174.245.137:4200"

KONG_ADMIN_URL="http://${KONG_ADMIN_IP}:${KONG_ADMIN_PORT}"

SERVICE_NAME="cart-service-upstream"
ROUTE_NAME="cart-api-route-external" # O el nombre que prefieras
ROUTE_PATH="/cart-api"

# --- Funciones ---
function check_command {
  # Esta función asume que curl -i se usa, y el código de salida de curl es suficiente.
  # Si curl tiene un error HTTP (ej. 409), su código de salida ($?) puede no ser 0.
  local curl_exit_code=$?
  if [ ${curl_exit_code} -ne 0 ]; then
    # Podríamos verificar códigos de error HTTP específicos si la respuesta se captura.
    # Por ahora, cualquier error de curl detiene el script.
    echo "Error: El comando curl anterior falló con código de salida ${curl_exit_code}. Saliendo."
    exit 1
  fi
  echo "Comando ejecutado." # Mensaje simple de éxito
}

echo "--- Configurando Kong API Gateway en ${KONG_ADMIN_URL} ---"

# 1. Crear el Service en Kong
echo ""
echo "Paso 1: Creando el Service '${SERVICE_NAME}'..."
curl -s -i -X POST \ # - s para modo silencioso menos output de curl mismo
  --url "${KONG_ADMIN_URL}/services/" \
  --header 'Content-Type: application/json' \
  --data @- << EOF
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
curl -s -i -X POST \
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

# 3. Habilitar el Plugin CORS en la Route
echo ""
echo "Paso 3: Habilitando el plugin CORS para la Route '${ROUTE_NAME}'..."
curl -s -i -X POST \
  --url "${KONG_ADMIN_URL}/routes/${ROUTE_NAME}/plugins" \
  --header 'Content-Type: application/json' \
  --data @- << EOF
{
    "name": "cors",
    "config": {
        "origins": ["${FRONTEND_ORIGIN_URL}"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "headers": ["Content-Type", "Authorization"],
        "exposed_headers": ["Content-Length", "Content-Range"],
        "credentials": true,
        "max_age": 3600
    }
}
EOF
check_command

echo ""
echo "--- Configuración de Kong completada ---"
echo "Tu servicio de carrito debería ser accesible a través de Kong en: http://${KONG_ADMIN_IP}:${KONG_PROXY_PORT}${ROUTE_PATH}/api/v1/cart/..."
echo "(Asegúrate de que el puerto del proxy ${KONG_PROXY_PORT} y el puerto admin ${KONG_ADMIN_PORT} estén abiertos en el firewall del servidor)"

exit 0