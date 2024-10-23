const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./db')
const port = 3000
const cors = require('cors');
//usamos multer para manejar archivos en el back
const multer = require('multer');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

//config multer
const storage = multer.memoryStorage(); // Esto almacenará los archivos en memoria como buffer
const upload = multer({ storage: storage });
//


app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })

  app.get('/users', db.getUsers);
  app.post('/users', db.createUser);
  app.post('/loginUser', db.loginUser);
  app.post('/getHorarios', db.getHorarios);
  app.post('/reserve', upload.single('comprobante'), db.createReservation);
  app.get('/getReservas', db.getReservas);
  app.get('/reservas/:id/comprobante', db.getComprobante);
  app.put('/reservas/:id/confirmarPago', db.confirmarPago);
  app.delete('/reservas/:id/cancelar', db.cancelarReserva);

  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })