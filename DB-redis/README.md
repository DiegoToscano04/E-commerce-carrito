<h1 align="center"> Proyecto Ingeniería de Software 2 - E-commerce </h1>
<h2 align="center"> Implementar Redis como Base de Datos del Carrito</h2>

-----------------------------

### Instalar Docker
Seguir los pasos necesarios para instalar Docker en el sistema operativo correspondiente, para el caso de Windows es necesario seguir los pasos enunciados en el siguiente link: https://docs.docker.com/desktop/setup/install/windows-install/

### Desplegar la DB de Redis
Con el siguiente comando se despliega la Base de Datos de Redis como un contenedor, no contiene contraseña en esta primera etapa: ```docker run -d -p 6379:6379 --name mi-redis redis```
