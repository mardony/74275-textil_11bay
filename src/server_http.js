
const http = require('http');

const server = http.createServer((req, res) => {
  res.end('Mi primer hola mundo con Node.js');
});

server.listen(8080, () => {
  console.log('Servidor escuchando en el puerto 8080 cambio' );
});