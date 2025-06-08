const socket = io();
const form = document.getElementById('productForm');
const list = document.getElementById('productList');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al agregar producto');
        }

        const newProduct = await response.json();
        socket.emit('addProduct', newProduct);
        form.reset();
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

socket.on('updateProducts', (products) => {
    list.innerHTML = '';

    products.forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `${p.name} - $${p.price} (${p.category})
        <button onclick="deleteProduct('${p._id}')">Eliminar</button>`;
        list.appendChild(li);
    });
});

function deleteProduct(id) {
    socket.emit('deleteProduct', id);
}