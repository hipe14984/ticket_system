# Ticket System

Este proyecto es un sistema de venta de boletos para una cancha de baloncesto profesional. Incluye funcionalidades para gestionar eventos, crear seating charts y vender boletos.

## Características

### Gestión de Seating Charts
- Crear seating charts personalizados para diferentes categorías (gradas, sillas, cancha, tableros).
- Guardar seating charts en la base de datos.
- Vincular seating charts con eventos.

### Gestión de Eventos
- Crear eventos con nombre, fecha, tipo y seating chart asociado.
- Listar eventos existentes.

### Venta de Boletos
- Seleccionar eventos y categorías.
- Visualizar y seleccionar asientos disponibles en un mapa interactivo.
- Registrar la venta de boletos.

## Tecnologías Utilizadas
- **Backend**: Node.js, Express
- **Base de Datos**: MySQL
- **Frontend**: HTML, CSS, Bootstrap, JavaScript

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/ticket_system.git
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura la base de datos:
   - Crea una base de datos en MySQL.
   - Ejecuta el archivo `db/schema.sql` para crear las tablas necesarias.

4. Configura las variables de entorno en un archivo `.env`:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu-contraseña
   DB_NAME=basketball_ticketing
   ```

5. Inicia el servidor:
   ```bash
   npm run dev
   ```

6. Accede a la aplicación en [http://localhost:3000](http://localhost:3000).

## Endpoints

### Seating Charts
- **POST** `/seating-charts`: Guardar un nuevo seating chart.
- **GET** `/seating-charts`: Obtener todos los seating charts.

### Eventos
- **POST** `/admin/events`: Crear un nuevo evento.
- **GET** `/events`: Listar todos los eventos.

### Boletos
- **POST** `/vendedor/tickets`: Vender un boleto.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.# ticket_system
