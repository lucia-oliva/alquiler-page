const request = require("supertest");
const { app } = require("../index"); // Asegúrate de que esta ruta sea correcta
const { Pool } = require("pg");
const { config } = require("dotenv");

// Cargar variables de entorno
config(); 

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

// Iniciar el servidor antes de ejecutar las pruebas
let server;

beforeAll(async () => {
  // Ahora ya no es necesario volver a iniciar el servidor aquí
  // Aquí puedes agregar datos de prueba si es necesario
});

afterAll(async () => {

  await pool.end(); // Cierra la conexión a la base de datos después de las pruebas
  // Aquí no es necesario cerrar el servidor porque no lo iniciamos nuevamente
});

describe("GET /getReservas", () => {
  it("debería obtener la lista de reservas con éxito", async () => {
    const response = await request(app).get("/getReservas"); // Usa app aquí
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("reservas");
    expect(Array.isArray(response.body.reservas)).toBe(true);
  });

});

describe('POST /users', () => {
  it('debería crear un nuevo usuario con éxito', async () => {
    const newUser = {
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '1234567890',
      email: 'juanitoperezeto244@example.com', // Asegúrate de usar un email único
      password: 'password123',
      asociado: true
    };

    const response = await request(app).post('/users').send(newUser);
    expect(response.statusCode).toBe(201);
    expect(response.body.type).toBe('success');
    expect(response.body.message).toMatch(/User added with ID: \d+/);
  });

  it('debería manejar errores de llave duplicada', async () => {
    const newUser = {
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '1234567890',
      email: 'juanitoperezeto244@example.com', // Mismo email para provocar duplicado
      password: 'password123',
      asociado: true
    };

    const response = await request(app).post('/users').send(newUser);
    expect(response.statusCode).toBe(400);
    expect(response.body.type).toBe('error');
    expect(response.body.message).toBe('El correo ya está registrado');
  });


  it('debería manejar errores generales', async () => {
    const newUser = {
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '1234567890',
      email: 'usuario.inexistente260@example.com', // Un email único para la creación
      password: null, // Intentar crear un usuario sin password para provocar error
      asociado: true
    };

    const response = await request(app).post('/users').send(newUser);
    expect(response.statusCode).toBe(500); // Aquí debería ser un error 500 si tienes validación en la creación
    expect(response.body.type).toBe('error');
    expect(response.body.message).toBe('Hubo un error al añadir el usuario');
  });
});
