-- Database: basketball_ticketing

CREATE DATABASE IF NOT EXISTS basketball_ticketing;
USE basketball_ticketing;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    event_type ENUM('regular', 'postseason', 'final') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    seating_chart_id INT,
    FOREIGN KEY (seating_chart_id) REFERENCES seating_charts(id)
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    event_id INT,
    sector ENUM('gradas', 'sillas', 'cancha', 'tableros') NOT NULL,
    seat_number VARCHAR(10),
    ticket_type ENUM('individual', 'season', 'postseason', 'final') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Tabla para guardar seating charts
CREATE TABLE IF NOT EXISTS seating_charts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    chart JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuarios de prueba
INSERT INTO users (name, email, password) VALUES
('Vendedor', 'vendedor@example.com', '$2a$10$abcdefghijklmnopqrstuv'),
('Administrador', 'admin@example.com', '$2a$10$abcdefghijklmnopqrstuv');

-- Insertar eventos de prueba
INSERT INTO events (name, event_date, event_type) VALUES
('Juego 1: Equipo A vs Equipo B', '2026-01-25', 'regular'),
('Juego 2: Equipo C vs Equipo D', '2026-01-30', 'regular');