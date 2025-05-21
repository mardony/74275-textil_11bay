const socket = io();

const form = document.getElementById('productForm');
const list = document.getElementById('productList');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    socket.emit('addProduct', data);
    form.reset();
});

socket.on('updateProducts', (products) => {
    list.innerHTML = '';
    products.forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `${p.name} - ${p.price}
            <button onclick="deleteProduct(${p.id})">Eliminar</button>`;
        list.appendChild(li);
    });
});

function deleteProduct(id) {
    socket.emit('deleteProduct', id);
}
