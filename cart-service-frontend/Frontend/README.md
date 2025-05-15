<h1 align="center"> Frontend Microservicio Carrito </h1>

<h3 align="center"> Trabajo en Navbar Realizado </h3>

<p align="center"> <img src= "https://github.com/user-attachments/assets/01f8ba8b-fab7-4f0c-8009-48cfa60a77ca"> </p>

---
<h3 align="center"> <mark>Anotaciones</mark> </h3>

El diseño del Navbar se planteó con __dos__ componentes, uno para el ```navbar-superior``` y otro para el ```navbar-inferior```, el _navbar-superior_ ya se encuentra avanzado, mientras que el _navbar-inferior_ aún no ha sido modificado adecuadamente con el diseño planteado.

---
## Microfontends Definición

Los Microfontends dividen una aplicación en varias partes independientes que pueden desarrollarse, desplegarse y mantenerse por separado. El carrito de compras será un microfrontend independiente que se integrará con otros módulos del e-commerce.

- **Tipos de Microfrontend.**
    - **Carga en el Cliente (Client-Side Composition)** – Se usan frameworks como Module Federation de Webpack.
    - **Carga en el Servidor (Server-Side Composition)** – El backend arma la interfaz y entrega un único HTML.
    - **Carga en el Borde (Edge-Side Includes)** – Se ensamblan partes de la UI en una CDN  (Content Delivery Network) la cual es una red de servidores distribuidos globalmente que almacenan y entregan contenido estático como imágenes, videos, archivos CSS, JavaScript, y en este caso, componentes de microfrontends.
    - **Microfrontends Basados en Web Components** – Cada módulo es un Web Component reutilizable.
    
    Para Angular, lo más común y recomendado es Webpack Module Federation el cual tiene mayores ventajas que Native Federation. Esto permite que los microfrontends sean cargados dinámicamente y comunicados con otros módulos del e-commerce.

<p align="center"> <img src= "https://github.com/user-attachments/assets/c3377b47-9631-4eab-b9b6-a944af9bf7c3"> </p>


