const { request } = require("express");
const Pool = require("pg").Pool;
const { config } = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

config();
const database = process.env.DATABASE;
const user = process.env.USER;
const host = process.env.HOST;
const password = process.env.PASSWORD;
const port = process.env.PORT;

const pool = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
});

//funcion para obtener usuarios.
const getUsers = (request, response) => {
  pool.query('SELECT * FROM public."tbUser"', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

//funcion para traer horarios

const getHorarios = (req, res) => {
  const { fecha } = req.body;

  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return res.status(400).json({ error: "Fecha inválida" });
  }
  pool.query(
    'SELECT hora_inicio, hora_fin, disponible from public."tbHorarios" where fecha = $1',
    [fecha],
    (error, results) => {
      if (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ error: 'Error en la consulta' });
      }
      res.status(200).json(results.rows);
    }
  );
};

//funcion registrar usuario

const createUser = (req, res) => {
  console.log(req.body);
  const { nombre, apellido, telefono, email, password, asociado } = req.body;

  pool.query(
    'INSERT INTO public."tbUser" (nombre, apellido, telefono, email, password, asociado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [nombre, apellido, telefono, email, password, asociado],
    (error, results) => {
      if (error) {
        console.error("Error al añadir el usuario", error);

        // Verifica si el error es por una llave duplicada
        if (error.code === "23505") {
          // Responde con un error de unicidad
          if (!res.headersSent) {
            return res
              .status(400)
              .json({ type: "error", message: "El correo ya está registrado" });
          }
        } else {
          // Responde con un error general
          if (!res.headersSent) {
            return res.status(500).json({
              type: "error",
              message: "Hubo un error al añadir el usuario",
            });
          }
        }
        return; // Termina la función para evitar enviar múltiples respuestas
      }

      // Responde con éxito si no hay errores
      if (!res.headersSent) {
        res.status(201).json({
          type: "sucess",
          message: `User added with ID: ${results.rows[0].id}`,
        });
      }
    }
  );
};

//Auntenticacion de usuario y generacion de token JWT
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM public."tbUser" WHERE email = $1',
      [email]
    );
    const user = result.rows[0];

    if (user && password === user.password) {
      const token = jwt.sign({ id: user.id }, "your_jwt_secret", {
        expiresIn: "1h",
      });
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUsers, createUser, loginUser, getHorarios };
