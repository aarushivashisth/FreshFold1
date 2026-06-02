-- create DB
CREATE DATABASE IF NOT EXISTS freshfold;
USE freshfold;

-- users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(30),
  role ENUM('customer','admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- services (catalog)
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price_per_unit DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- orders
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_mode VARCHAR(30) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  status VARCHAR(50) DEFAULT 'placed',
  pickup_slot VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- order_services (each row = service item inside order)
CREATE TABLE IF NOT EXISTS order_services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  service_id INT NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id)
);

-- feedback
CREATE TABLE IF NOT EXISTS feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  order_id INT NULL,
  message TEXT,
  rating INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

SELECT * FROM users;

INSERT INTO services (name, description, price_per_unit)
VALUES
('Washing', 'Standard wash', 40.00),
('Ironing', 'Ironing service', 20.00),
('Dry Clean', 'Dry-clean for delicate clothes', 80.00),
('Premium Wash', 'Gentle premium wash', 60.00);

select * from users;

SELECT id, username, role FROM users;
UPDATE users SET role='admin' WHERE username='admin';

SELECT username, role FROM users;

ALTER TABLE orders
ADD COLUMN current_step INT DEFAULT 0,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

CREATE TABLE feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  rating INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

SELECT * FROM users;

SELECT * FROM users;

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  item_type VARCHAR(100),
  quantity INT,
  services VARCHAR(255),
  price_rate INT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);