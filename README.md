# Textil Oncebay API

API RESTful para la gestión de productos textiles artesanales y carritos de compra, diseñada para Textil Oncebay. Permite administrar tapices, accesorios y otros productos artesanales, facilitando la experiencia de compra en línea.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades Clave](#funcionalidades-clave)
- [Capturas de Pantalla](#capturas-pantalla)
- [API Endpoints](#api-endpoints)
- [Licencia](#licencia)
- [Créditos](#créditos)

## Descripción

Textil Oncebay API es un servidor Node.js basado en Express que permite:

- Gestionar productos textiles artesanales (tapices, accesorios, etc.)
- Crear y administrar carritos de compra
- Persistir la información en archivos JSON para fácil manejo y portabilidad

## Características

- API RESTful modular y escalable
- Manejo de productos con campos personalizados para textiles artesanales
- Carritos de compra con gestión de cantidades
- Persistencia mediante sistema de archivos (`products.json`, `carts.json`)
- Código organizado y fácil de mantener

## Estructura del Proyecto
src/
├── app.js                  # Punto de entrada principal
├── config/
│   ├── db.js               # Configuración de MongoDB
│   └── cloudinary.js       # Configuración de Cloudinary
├── dao/
│   ├── managers/           # Lógica de negocio
│   │   ├── CartManager.js
│   │   └── ProductManager.js
│   └── models/             # Modelos de datos
│       ├── cart.model.js
│       └── product.model.js
├── initializeDB.js         # Inicialización de datos
├── middlewares/
│   └── imageUpload.js      # Middleware para subida de imágenes
├── public/                 # Archivos estáticos
│   └── js/
│       └── realtime.js
├── routes/                 # Definición de rutas
│   ├── carts.router.js
│   ├── products.router.js
│   └── views.router.js
├── utils/                  # Utilidades
│   ├── handlebarsHelpers.js
│   ├── pagination.js
│   └── socketUtils.js
└── views/                  # Vistas Handlebars
    ├── cart.handlebars
    ├── error.handlebars
    ├── home.handlebars
    ├── layouts/
    │   └── main.handlebars
    ├── productDetail.handlebars
    └── realTimeProducts.handlebars


## Funcionalidades clave
### Gestión de productos
- Listado paginado con filtros por categoría
- Ordenamiento por precio (asc/desc)
- Vista detallada de productos
- Subida de hasta 5 imágenes por producto
- Eliminación con borrado de imágenes en Cloudinary

### Carrito de compras
- Sistema de carrito persistente con ID fijo
- Agregar/eliminar productos
- Actualizar cantidades
- Cálculo automático de totales
- Gestión de stock en tiempo real
- Vaciar carrito completo

### Tiempo real
- Actualización instantánea de productos
- Agregar/eliminar productos sin recargar
- Notificaciones de acciones

## Capturas de pantalla
- Vista principal de productos
https://ejemplo.com/products-screenshot.png
Listado de productos con paginación y filtros

- Detalle de producto
https://ejemplo.com/product-detail.png
Vista detallada con galería de imágenes

- Carrito de compras
https://ejemplo.com/cart-screenshot.png
Gestión de productos en el carrito con cálculo de totales

- Vista en tiempo real
https://ejemplo.com/realtime-screenshot.png
Panel de administración en tiempo real

## API Endpoints
### Productos
- GET /api/products - Listar productos (paginado)

- GET /api/products/:pid - Obtener producto por ID

- POST /api/products - Crear nuevo producto

- PUT /api/products/:id - Actualizar producto

- DELETE /api/products/:id - Eliminar producto

### Carritos
- POST /api/carts - Crear nuevo carrito

- GET /api/carts/:cid - Obtener carrito por ID

- POST /api/carts/:cid/product/:pid - Agregar producto al carrito

- PUT /api/carts/:cid - Actualizar carrito completo

- PUT /api/carts/:cid/products/:pid - Actualizar cantidad de producto

- DELETE /api/carts/:cid/products/:pid - Eliminar producto del carrito

- DELETE /api/carts/:cid - Vaciar carrito

## Licencia
Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

## Créditos

Desarrollado para Textil Oncebay, promoviendo la artesanía textil y la innovación tecnológica.
