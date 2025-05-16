<h1 align="center"> Proyecto Ingeniería de Software 2 - E-commerce </h1>
<h2 align="center"> Implementar RabbitMQ como Bus de Mensajería para Manejar la Asincronía</h2>

-----------------------------

### Instalar Docker
Seguir los pasos necesarios para instalar Docker en el sistema operativo correspondiente, para el caso de Windows es necesario seguir los pasos enunciados en el siguiente link: https://docs.docker.com/desktop/setup/install/windows-install/

### Desplegar RabbitMQ
Con el siguiente comando se despliega RabbitMQ como un contenedor: ```docker run -d --hostname my-rabbit --name some-rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management```

Esto inicia RabbitMQ y expone:

Puerto ```5672:``` Para conexiones AMQP (el que usa Spring Boot).

Puerto ```15672:``` Para la interfaz de administración web de RabbitMQ se accede por medio de: ```http://localhost:15672``` y las credenciales de acceso son: ```login: guest/guest```.
