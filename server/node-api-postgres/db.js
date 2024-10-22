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
  const { fecha, cancha } = req.body;

  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return res.status(400).json({ error: "Fecha inválida" });
  }
  pool.query(
    'SELECT hora_inicio, hora_fin, disponible from public."tbHorarios" where fecha = $1 and cancha_horarios_fk = $2',
    [fecha, cancha],
    (error, results) => {
      if (error) {
        console.error("Error en la consulta:", error);
        return res.status(500).json({ error: "Error en la consulta" });
      }
      res.status(200).json(results.rows);
      console.log(results.rows);
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
    console.log("Datos recibidos para el login:", { email, password });
    const result = await pool.query(
      'SELECT * FROM public."tbUser" WHERE email = $1',
      [email]
    );
    const user = result.rows[0];

    console.log("Usuario encontrado:", user);
    if (user && password === user.password) {
      const token = jwt.sign(
        { id: user.id, admin: user.admin },
        "your_jwt_secret",
        {
          expiresIn: "1h",
        }
      );

      res.json({ token, admin: user.admin }); // Devolver también si es admin o no
      console.log("Generando token y devolviendo datos:", {
        token,
        admin: user.admin,
      });
    } else {
      res.status(401).json({ message: "Credenciales inválidas" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//funcion para crear reserva
const createReservation = async (req, res) => {
  const { fecha, email, cancha_id, horario_inicio, horario_fin } = req.body;
  const comprobante = req.file; // Asumo que el archivo PDF se sube correctamente con middleware como 'multer' para manejar archivos

  //formateamos horarios recibidos del front
  const formattedHorarioInicio = horario_inicio ? `${horario_inicio}:00` : null; // Formato 'HH:MM:SS'
  const formattedHorarioFin = horario_fin ? `${horario_fin}:00` : null; // Formato 'HH:MM:SS'

  //verificamos datos recibidos
  console.log("Datos recibidos del frontend:", {
    email,
    cancha_id,
    horario_inicio,
    horario_fin,
    fecha,
  });

  try {
    // 1. Buscar el usuario que hace la reserva
    const userResult = await pool.query(
      'SELECT id FROM public."tbUser" WHERE email = $1',
      [email]
    );
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 2. Crear un registro en la tabla "tbHorarios"
    const horarioResult = await pool.query(
      `INSERT INTO public."tbHorarios" (fecha, hora_inicio, hora_fin, disponible, cancha_horarios_fk) 
       VALUES ($1, $2, $3, false, $4) 
       RETURNING id`,
      [fecha, formattedHorarioInicio, formattedHorarioFin, cancha_id]
    );
    const horarioId = horarioResult.rows[0].id;

    // 3. Crear un registro en la tabla "tbReservas" con la referencia del horario creado
    await pool.query(
      `INSERT INTO public."tbReservas" (user_fk, canchas_fk, horarios_fk, comprobante) 
       VALUES ($1, $2, $3, $4)`,
      [user.id, cancha_id, horarioId, comprobante ? comprobante.buffer : null]
    );

    res.status(201).json({ message: "Reserva creada exitosamente" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al crear la reserva" });
  }
};

// Función para obtener reservas
const getReservas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.id,c.id AS cancha_id, c.tipo AS cancha,h.hora_inicio , , h.fecha, r.pago_total, u.email as usuario_email,u.nombre,u.apellido
      FROM public."tbReservas" r
      JOIN public."tbCanchas" c ON r.canchas_fk = c.id
      JOIN public."tbHorarios" h on r.horarios_fk = h.id
      JOIN public."tbUser" u ON r.user_fk = u.id
    `);

    const reservas = result.rows;
    console.log("Reservas obtenidas:", reservas); // Para depuración

    //const reservas = result.rows; // Obtener las reservas
    res.json({ reservas }); // Enviar las reservas como respuesta
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al obtener reservas" });
  }
};

const getComprobante = async (req, res) => {
  const { id } = req.params; // Obtener el ID de la reserva desde la URL

  try {
    // 1. Buscar el comprobante en la tabla "tbReservas"
    const result = await pool.query(
      'SELECT comprobante FROM public."tbReservas" WHERE id = $1',
      [id]
    );

    const comprobante = result.rows[0]?.comprobante;

    // 2. Verificar si se encontró el comprobante
    if (comprobante) {
      res.setHeader("Content-Type", "application/pdf"); // Especificar el tipo de contenido como PDF
      res.send(comprobante); // Enviar el comprobante como respuesta
    } else {
      res.status(404).json({ message: "Comprobante no encontrado" });
    }
  } catch (err) {
    console.error("Error al recuperar comprobante:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//funcion para confirmar pago
const confirmarPago = async (req, res) => {
  const { id } = req.params;
  const { pago_total } = req.body;

  try {
    await pool.query(
      'UPDATE public."tbReservas" SET pago_total = $1 WHERE id = $2',
      [pago_total, id]
    );
    res.status(200).json({ message: "Pago confirmado" });
  } catch (err) {
    console.error("Error al confirmar pago:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//funcion para cancelar reserva
const cancelarReserva = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Obtener el ID del horario relacionado a la reserva
    const horarioResult = await pool.query(
      'SELECT horarios_fk FROM public."tbReservas" WHERE id = $1',
      [id]
    );
    const horarioId = horarioResult.rows[0]?.horarios_fk;

    if (!horarioId) {
      return res
        .status(404)
        .json({ message: "Horario no encontrado para la reserva" });
    }

    // 2. Eliminar la reserva
    await pool.query('DELETE FROM public."tbReservas" WHERE id = $1', [id]);

    // 3. Eliminar el horario relacionado
    await pool.query('DELETE FROM public."tbHorarios" WHERE id = $1', [
      horarioId,
    ]);

    res.status(200).json({ message: "Reserva y horario eliminados" });
  } catch (err) {
    console.error("Error al cancelar reserva y eliminar horario:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  getUsers,
  createUser,
  loginUser,
  getHorarios,
  createReservation,
  getReservas,
  getComprobante,
  confirmarPago,
  cancelarReserva,
};
