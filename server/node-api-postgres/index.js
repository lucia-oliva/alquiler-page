const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./db')
const port = 4000
const cors = require('cors');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());




app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })

  app.get('/users', db.getUsers);
  app.post('/users', db.createUser);
  app.post('/loginUser', db.loginUser);
  app.post('/getHorarios', db.getHorarios);

  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })