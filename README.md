# Textil Oncebay API

API RESTful para la gestión de productos textiles artesanales y carritos de compra, diseñada para Textil Oncebay. Permite administrar tapices, accesorios y otros productos artesanales, facilitando la experiencia de compra en línea.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [Endpoints Principales](#endpoints-principales)
- [Persistencia de Datos](#persistencia-de-datos)
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

project_textil_11bay/
│
├── package.json
├── src/
│   ├── app.js
│   ├── config/
│   │   └── db.js
│   ├── dao/
│   │   ├── managers/
│   │   │   ├── CartManager.js
│   │   │   └── ProductManager.js
│   │   └── models/
│   │       ├── cart.model.js
│   │       └── product.model.js
│   ├── data/
│   │   └── (archivos JSON iniciales)
│   ├── public/
│   │   └── js/
│   │       └── realtime.js
│   ├── routes/
│   │   ├── carts.router.js
│   │   ├── products.router.js
│   │   └── views.router.js
│   ├── utils/
│   │   ├── pagination.js
│   │   └── socketUtils.js
│   └── views/
│       ├── cart.handlebars
│       ├── layouts/
│       │   └── main.handlebars
│       ├── home.handlebars
│       ├── productDetail.handlebars
│       └── realTimeProducts.handlebars


El servidor escuchará en el puerto **8080**.

## Uso

Utiliza herramientas como **Postman** o **cURL** para interactuar con la API. Ejemplo para agregar un producto:

curl -X POST -H "Content-Type: application/json" -d '{
  "title": "Tapiz Andino",
  "description": "Tapiz artesanal tejido a mano",
  "code": "TA001",
  "price": 120.00,
  "stock": 10,
  "category": "tapices"
}' http://localhost:8080/api/products


## Endpoints Principales

### Productos (`/api/products/`)
- `GET /` : Lista todos los productos.
- `GET /:pid` : Muestra un producto por ID.
- `POST /` : Agrega un nuevo producto.
- `PUT /:pid` : Actualiza un producto existente.
- `DELETE /:pid` : Elimina un producto.

### Carritos (`/api/carts/`)
- `POST /` : Crea un nuevo carrito.
- `GET /:cid` : Lista los productos de un carrito.
- `POST /:cid/product/:pid` : Agrega un producto al carrito.

## Persistencia de Datos

La información se almacena en archivos JSON ubicados en la carpeta `data/`:
- `products.json`
- `carts.json`

Esto permite un fácil respaldo, portabilidad y migración futura a bases de datos más robustas.

## Créditos

Desarrollado para Textil Oncebay, promoviendo la artesanía textil y la innovación tecnológica.
