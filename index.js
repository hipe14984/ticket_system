require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'basketball_ticketing'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the database.');
});

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Basketball Ticketing System!');
});

// Ruta para registrar usuarios
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'El correo ya está registrado.' });
        }
        return res.status(500).json({ message: 'Error al registrar el usuario.' });
      }
      res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al buscar el usuario.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso.', user: { id: user.id, name: user.name, email: user.email } });
  });
});

// Ruta para obtener el calendario de eventos
app.get('/events', (req, res) => {
  const query = 'SELECT * FROM events ORDER BY event_date';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener los eventos.' });
    }
    res.status(200).json(results);
  });
});

// Middleware para verificar roles
function verifyRole(role) {
  return (req, res, next) => {
    const { email } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err || results.length === 0) {
        return res.status(403).json({ message: 'Acceso denegado.' });
      }

      const user = results[0];
      if ((role === 'admin' && user.email === 'admin@example.com') ||
          (role === 'vendedor' && user.email === 'vendedor@example.com')) {
        next();
      } else {
        res.status(403).json({ message: 'Acceso denegado.' });
      }
    });
  };
}

// Ruta protegida para gestión de eventos (solo administrador)
app.post('/admin/events', verifyRole('admin'), (req, res) => {
  const { name, event_date, event_type, seating_chart_id } = req.body;

  if (!name || !event_date || !event_type || !seating_chart_id) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  const query = 'INSERT INTO events (name, event_date, event_type, seating_chart_id) VALUES (?, ?, ?, ?)';
  db.query(query, [name, event_date, event_type, seating_chart_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al crear el evento.' });
    }
    res.status(201).json({ message: 'Evento creado exitosamente.' });
  });
});

// Ruta para actualizar un evento
app.put('/admin/events/:id', (req, res) => {
  const { id } = req.params;
  const { name, event_date, event_type, seating_chart_id } = req.body;

  if (!name || !event_date || !event_type || !seating_chart_id) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  const query = 'UPDATE events SET name = ?, event_date = ?, event_type = ?, seating_chart_id = ? WHERE id = ?';
  db.query(query, [name, event_date, event_type, seating_chart_id, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al actualizar el evento.' });
    }
    res.status(200).json({ message: 'Evento actualizado exitosamente.' });
  });
});

// Ruta para eliminar un evento
app.delete('/admin/events/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM events WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al eliminar el evento.' });
    }
    res.status(200).json({ message: 'Evento eliminado exitosamente.' });
  });
});

// Ruta para vender boletos (corrección de lógica)
app.post('/vendedor/tickets', (req, res) => {
  const { event_id, sector, seat_number, ticket_type } = req.body;

  if (!event_id || !sector || !ticket_type || !seat_number) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  const query = 'INSERT INTO tickets (event_id, sector, seat_number, ticket_type) VALUES (?, ?, ?, ?)';
  db.query(query, [event_id, sector, seat_number, ticket_type], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al vender el boleto.' });
    }
    res.status(201).json({ message: 'Boleto vendido exitosamente.' });
  });
});

// Ruta para obtener asientos disponibles por sector y evento
app.get('/seats/:eventId/:sector', (req, res) => {
  const { eventId, sector } = req.params;

  const query = `
    SELECT seat_number FROM tickets
    WHERE event_id = ? AND sector = ?
  `;

  db.query(query, [eventId, sector], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener los asientos disponibles.' });
    }

    const occupiedSeats = results.map(row => row.seat_number);
    res.status(200).json({ occupiedSeats });
  });
});

// Ruta para guardar un seating chart
app.post('/seating-charts', (req, res) => {
  const { name, chart } = req.body;

  if (!name || !chart) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  const query = 'INSERT INTO seating_charts (name, chart) VALUES (?, ?)';
  db.query(query, [name, JSON.stringify(chart)], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al guardar el seating chart.' });
    }
    res.status(201).json({ message: 'Seating chart guardado exitosamente.' });
  });
});

// Ruta para obtener todos los seating charts
app.get('/seating-charts', (req, res) => {
  const query = 'SELECT * FROM seating_charts';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener los seating charts.' });
    }
    res.status(200).json(results);
  });
});

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada.' });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});