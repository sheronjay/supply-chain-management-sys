SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET time_zone = '+00:00';

CREATE DATABASE IF NOT EXISTS `supplychain`;
USE `supplychain`;

-- =========================
-- Core reference tables
-- =========================
CREATE TABLE IF NOT EXISTS stores (
  store_id        VARCHAR(255) PRIMARY KEY,
  city_id         VARCHAR(255),
  station_id      VARCHAR(255),
  address         VARCHAR(255),
  type            VARCHAR(255),
  is_open         TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS trains (
  train_id        VARCHAR(255) PRIMARY KEY,
  train_name      VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS trucks (
  truck_id        VARCHAR(255) PRIMARY KEY,
  store_id        VARCHAR(255),
  reg_number      VARCHAR(255),                  -- unique vehicle registration
  used_hours      DECIMAL(6,2),
  availability    TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT uq_trucks_reg UNIQUE (reg_number),
  CONSTRAINT fk_trucks_store
    FOREIGN KEY (store_id) REFERENCES stores(store_id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vehicles (
  vehicle_id        VARCHAR(255) PRIMARY KEY,
  vehicle_type      VARCHAR(255),
  vehicle_status    TINYINT(1) NOT NULL DEFAULT 1,
  register_number   VARCHAR(255),
  CONSTRAINT uq_vehicles_register_number UNIQUE (register_number)
) ENGINE=InnoDB;

-- =========================
-- Train operations
-- =========================
CREATE TABLE IF NOT EXISTS train_schedules (
  trip_id        VARCHAR(255) PRIMARY KEY,
  day_date       DATE,                            -- ERD: Day (date)
  start_time     TIME,
  train_id       VARCHAR(255),
  end_store_id   VARCHAR(255),                    -- ERD had FK "End" -> interpret as destination store
  CONSTRAINT fk_ts_train
    FOREIGN KEY (train_id) REFERENCES trains(train_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_ts_end_store
    FOREIGN KEY (end_store_id) REFERENCES stores(store_id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS destinations (
  destination_id   VARCHAR(255) PRIMARY KEY,      -- ERD: Destination ID
  trip_id          VARCHAR(255),
  store_id         VARCHAR(255),
  arrival          VARCHAR(255),                  -- ERD lists as varchar; change to TIME if desired
  departure        VARCHAR(255),
  CONSTRAINT fk_dest_trip
    FOREIGN KEY (trip_id) REFERENCES train_schedules(trip_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_dest_store
    FOREIGN KEY (store_id) REFERENCES stores(store_id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================
-- Routing
-- =========================
CREATE TABLE IF NOT EXISTS truck_routes (
  route_id        VARCHAR(255) PRIMARY KEY,
  truck_id        VARCHAR(255),
  end_location    VARCHAR(255),
  distance_km     DECIMAL(8,2),
  start_location  VARCHAR(255),
  KEY idx_truck_routes_truck (truck_id),
  CONSTRAINT fk_truck_routes_truck
    FOREIGN KEY (truck_id) REFERENCES trucks(truck_id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================
-- Products & Orders
-- =========================
CREATE TABLE IF NOT EXISTS products (
  product_id                 VARCHAR(255) PRIMARY KEY,
  product_name               VARCHAR(255),
  unit_price                 DECIMAL(8,2),
  space_consumption_rate     DECIMAL(8,2),
  stock_quantity             INT,
  order_per_quarter          INT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customers (
  customer_id     VARCHAR(255) PRIMARY KEY,
  email           VARCHAR(255),
  phone_number    VARCHAR(32),                    -- ERD shows int; using VARCHAR is safer
  city            VARCHAR(255),
  name            VARCHAR(255),
  password        VARCHAR(255),                   -- Hashed password for authentication
  CONSTRAINT uq_customers_email UNIQUE (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  order_id        VARCHAR(255) PRIMARY KEY,
  customer_id     VARCHAR(255),
  store_id        VARCHAR(255),
  route_id        VARCHAR(255),
  ordered_date    DATE,
  total_price     DECIMAL(8,2),
  status          VARCHAR(255),
  KEY idx_orders_customer (customer_id),
  KEY idx_orders_store (store_id),
  KEY idx_orders_route (route_id),
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_orders_store
    FOREIGN KEY (store_id) REFERENCES stores(store_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_orders_route
    FOREIGN KEY (route_id) REFERENCES truck_routes(route_id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  order_id        VARCHAR(255),
  product_id      VARCHAR(255),
  quantity        INT,
  item_capacity   INT,
  unit_price      DECIMAL(8,2),
  PRIMARY KEY (order_id, product_id),
  KEY idx_oi_product (product_id),
  CONSTRAINT fk_oi_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_oi_product
    FOREIGN KEY (product_id) REFERENCES products(product_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =========================
-- Delivery
-- =========================
CREATE TABLE IF NOT EXISTS delivery_schedules (
  delivery_id            VARCHAR(255) PRIMARY KEY,
  order_id               VARCHAR(255),
  vehicle_id             VARCHAR(255),
  delivered_date         DATE,
  vehicle_arrival_time   TIME,
  vehicle_departure_time TIME,
  delivery_status        TINYINT(1) NOT NULL DEFAULT 0,
  KEY idx_ds_order (order_id),
  KEY idx_ds_vehicle (vehicle_id),
  CONSTRAINT fk_ds_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_ds_vehicle
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

DROP VIEW IF EXISTS order_delivery_tracking;
CREATE VIEW order_delivery_tracking AS
SELECT
  o.order_id,
  o.ordered_date,
  o.status,
  ds.delivered_date
FROM orders AS o
LEFT JOIN delivery_schedules AS ds ON ds.order_id = o.order_id;

DROP VIEW IF EXISTS order_items_view;
CREATE VIEW order_items_view AS
SELECT
  oi.order_id,
  oi.product_id,
  p.product_name,
  oi.quantity,
  oi.unit_price,
  (oi.quantity * oi.unit_price) AS amount
FROM order_items AS oi
LEFT JOIN products AS p ON oi.product_id = p.product_id;

-- =========================
-- Users & Roles
-- =========================
CREATE TABLE IF NOT EXISTS users (
  user_id       VARCHAR(255) PRIMARY KEY,
  store_id      VARCHAR(255),
  name          VARCHAR(255),
  password      VARCHAR(255),
  designation   VARCHAR(255),
  is_employed   TINYINT(1) NOT NULL DEFAULT 1,
  KEY idx_users_store (store_id),
  CONSTRAINT fk_users_store
    FOREIGN KEY (store_id) REFERENCES stores(store_id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- Role specializations shown in ERD:
CREATE TABLE IF NOT EXISTS store_managers (
  manager_id   VARCHAR(255) PRIMARY KEY,          -- ERD “Store manager (PK Manager_ID)”
  CONSTRAINT fk_store_managers_user
    FOREIGN KEY (manager_id) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS delivery_employees (
  user_id         VARCHAR(255) PRIMARY KEY,       -- ERD “Delivery employee (PK User_ID)”
  working_hours   VARCHAR(255),
  availability    TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT fk_delivery_employees_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS admins (
  admin_id     VARCHAR(255) PRIMARY KEY,
  username     VARCHAR(255),
  email        VARCHAR(255),
  password     VARCHAR(255),
  CONSTRAINT uq_admins_username UNIQUE (username),
  CONSTRAINT uq_admins_email UNIQUE (email)
) ENGINE=InnoDB;

-- =========================
-- Core reference data
-- =========================
INSERT INTO stores (store_id, city_id, station_id, address, type, is_open) VALUES
('ST-KDY-01','Kandy','SLR-KDY','No.12 William Gopallawa Mawatha, Kandy','Warehouse',1),
('ST-CMB-01','Colombo','SLR-CMBF','No.1 Olcott Mawatha, Colombo 11','Regional Store',1),
('ST-NGO-01','Negombo','SLR-NGO','No.233 Chilaw Rd, Negombo','Regional Store',1),
('ST-GAL-01','Galle','SLR-GAL','No.45 Rampart Rd, Galle','Regional Store',1),
('ST-MAT-01','Matara','SLR-MAT','No.88 Beach Rd, Matara','Regional Store',1),
('ST-JAF-01','Jaffna','SLR-JAF','No.20 KKS Rd, Jaffna','Regional Store',1),
('ST-TRI-01','Trincomalee','SLR-TRI','No.17 Dockyard Rd, Trincomalee','Regional Store',1),
('ST-KDY-02','Kandy','SLR-KDY','No.5 Peradeniya Rd, Kandy','Retail',1);

INSERT INTO trains (train_id, train_name) VALUES
('TRN-UD1','Udarata Cargo 1'),
('TRN-CST','Coastal Cargo'),
('TRN-NOR','Northern Cargo'),
('TRN-EAS','Eastern Cargo');

INSERT INTO trucks (truck_id, store_id, reg_number, used_hours, availability) VALUES
('TRK-001','ST-CMB-01','WP-NA-1234', 812.50,1),
('TRK-002','ST-NGO-01','WP-KK-5678', 420.00,1),
('TRK-003','ST-GAL-01','SP-PA-2345', 355.75,1),
('TRK-004','ST-MAT-01','SP-KM-9876', 602.30,1),
('TRK-005','ST-JAF-01','NP-GH-1122', 190.00,1),
('TRK-006','ST-TRI-01','EP-TR-3344', 260.50,1),
('TRK-007','ST-CMB-01','WP-CB-8899', 120.00,1),
('TRK-008','ST-NGO-01','WP-NG-6611', 205.90,1),
('TRK-009','ST-GAL-01','SP-GL-7788', 410.25,1),
('TRK-010','ST-MAT-01','SP-MT-4455', 140.60,1);

INSERT INTO vehicles (vehicle_id, vehicle_type, vehicle_status, register_number) VALUES
('VEH-001','Truck',1,'WP-NA-1234'),
('VEH-002','Truck',1,'WP-KK-5678'),
('VEH-003','Truck',1,'SP-PA-2345'),
('VEH-004','Truck',1,'SP-KM-9876'),
('VEH-005','Truck',1,'NP-GH-1122'),
('VEH-006','Truck',1,'EP-TR-3344'),
('VEH-007','Truck',1,'WP-CB-8899'),
('VEH-008','Truck',1,'WP-NG-6611'),
('VEH-009','Truck',1,'SP-GL-7788'),
('VEH-010','Truck',1,'SP-MT-4455');

-- =========================
-- Train operations
-- =========================
INSERT INTO train_schedules (trip_id, day_date, start_time, train_id, end_store_id) VALUES
('TRIP-2025-08-01-CMB','2025-08-01','06:00:00','TRN-UD1','ST-CMB-01'),
('TRIP-2025-08-03-GAL','2025-08-03','06:00:00','TRN-CST','ST-GAL-01'),
('TRIP-2025-08-05-JAF','2025-08-05','05:30:00','TRN-NOR','ST-JAF-01'),
('TRIP-2025-08-07-TRI','2025-08-07','05:30:00','TRN-EAS','ST-TRI-01'),
('TRIP-2025-08-15-CMB','2025-08-15','06:00:00','TRN-UD1','ST-CMB-01'),
('TRIP-2025-08-17-NGO','2025-08-17','06:00:00','TRN-UD1','ST-NGO-01'),
('TRIP-2025-08-19-MAT','2025-08-19','06:00:00','TRN-CST','ST-MAT-01'),
('TRIP-2025-09-01-CMB','2025-09-01','06:00:00','TRN-UD1','ST-CMB-01'),
('TRIP-2025-09-03-GAL','2025-09-03','06:00:00','TRN-CST','ST-GAL-01'),
('TRIP-2025-09-05-JAF','2025-09-05','05:30:00','TRN-NOR','ST-JAF-01'),
('TRIP-2025-09-07-TRI','2025-09-07','05:30:00','TRN-EAS','ST-TRI-01'),
('TRIP-2025-09-15-CMB','2025-09-15','06:00:00','TRN-UD1','ST-CMB-01'),
('TRIP-2025-09-17-NGO','2025-09-17','06:00:00','TRN-UD1','ST-NGO-01'),
('TRIP-2025-09-19-MAT','2025-09-19','06:00:00','TRN-CST','ST-MAT-01'),
('TRIP-2025-10-01-CMB','2025-10-01','06:00:00','TRN-UD1','ST-CMB-01'),
('TRIP-2025-10-03-GAL','2025-10-03','06:00:00','TRN-CST','ST-GAL-01'),
('TRIP-2025-10-05-JAF','2025-10-05','05:30:00','TRN-NOR','ST-JAF-01'),
('TRIP-2025-10-07-TRI','2025-10-07','05:30:00','TRN-EAS','ST-TRI-01'),
('TRIP-2025-10-15-CMB','2025-10-15','06:00:00','TRN-UD1','ST-CMB-01'),
('TRIP-2025-10-17-NGO','2025-10-17','06:00:00','TRN-UD1','ST-NGO-01'),
('TRIP-2025-10-19-MAT','2025-10-19','06:00:00','TRN-CST','ST-MAT-01'),
('TRIP-2025-10-25-CMB','2025-10-25','06:00:00','TRN-UD1','ST-CMB-01'),
('TRIP-2025-10-27-GAL','2025-10-27','06:00:00','TRN-CST','ST-GAL-01'),
('TRIP-2025-10-29-JAF','2025-10-29','05:30:00','TRN-NOR','ST-JAF-01');

INSERT INTO destinations (destination_id, trip_id, store_id, arrival, departure) VALUES
-- August Destinations
('DST-0001','TRIP-2025-08-01-CMB','ST-KDY-01','05:40','06:00'),
('DST-0002','TRIP-2025-08-01-CMB','ST-CMB-01','08:30','08:50'),

('DST-0003','TRIP-2025-08-03-GAL','ST-KDY-01','05:40','06:00'),
('DST-0004','TRIP-2025-08-03-GAL','ST-GAL-01','09:40','10:00'),

('DST-0005','TRIP-2025-08-05-JAF','ST-KDY-01','05:10','05:30'),
('DST-0006','TRIP-2025-08-05-JAF','ST-JAF-01','12:05','12:25'),

('DST-0007','TRIP-2025-08-07-TRI','ST-KDY-01','05:10','05:30'),
('DST-0008','TRIP-2025-08-07-TRI','ST-TRI-01','11:25','11:45'),

('DST-0009','TRIP-2025-08-15-CMB','ST-KDY-01','05:40','06:00'),
('DST-0010','TRIP-2025-08-15-CMB','ST-CMB-01','08:30','08:50'),

('DST-0011','TRIP-2025-08-17-NGO','ST-KDY-01','05:40','06:00'),
('DST-0012','TRIP-2025-08-17-NGO','ST-NGO-01','08:00','08:15'),

('DST-0013','TRIP-2025-08-19-MAT','ST-KDY-01','05:40','06:00'),
('DST-0014','TRIP-2025-08-19-MAT','ST-MAT-01','10:30','10:45'),

-- September Destinations
('DST-0015','TRIP-2025-09-01-CMB','ST-KDY-01','05:40','06:00'),
('DST-0016','TRIP-2025-09-01-CMB','ST-CMB-01','08:30','08:50'),

('DST-0017','TRIP-2025-09-03-GAL','ST-KDY-01','05:40','06:00'),
('DST-0018','TRIP-2025-09-03-GAL','ST-GAL-01','09:40','10:00'),

('DST-0019','TRIP-2025-09-05-JAF','ST-KDY-01','05:10','05:30'),
('DST-0020','TRIP-2025-09-05-JAF','ST-JAF-01','12:05','12:25'),

('DST-0021','TRIP-2025-09-07-TRI','ST-KDY-01','05:10','05:30'),
('DST-0022','TRIP-2025-09-07-TRI','ST-TRI-01','11:25','11:45'),

('DST-0023','TRIP-2025-09-15-CMB','ST-KDY-01','05:40','06:00'),
('DST-0024','TRIP-2025-09-15-CMB','ST-CMB-01','08:30','08:50'),

('DST-0025','TRIP-2025-09-17-NGO','ST-KDY-01','05:40','06:00'),
('DST-0026','TRIP-2025-09-17-NGO','ST-NGO-01','08:00','08:15'),

('DST-0027','TRIP-2025-09-19-MAT','ST-KDY-01','05:40','06:00'),
('DST-0028','TRIP-2025-09-19-MAT','ST-MAT-01','10:30','10:45'),

-- October Destinations
('DST-0029','TRIP-2025-10-01-CMB','ST-KDY-01','05:40','06:00'),
('DST-0030','TRIP-2025-10-01-CMB','ST-CMB-01','08:30','08:50'),

('DST-0031','TRIP-2025-10-03-GAL','ST-KDY-01','05:40','06:00'),
('DST-0032','TRIP-2025-10-03-GAL','ST-GAL-01','09:40','10:00'),

('DST-0033','TRIP-2025-10-05-JAF','ST-KDY-01','05:10','05:30'),
('DST-0034','TRIP-2025-10-05-JAF','ST-JAF-01','12:05','12:25'),

('DST-0035','TRIP-2025-10-07-TRI','ST-KDY-01','05:10','05:30'),
('DST-0036','TRIP-2025-10-07-TRI','ST-TRI-01','11:25','11:45'),

('DST-0037','TRIP-2025-10-15-CMB','ST-KDY-01','05:40','06:00'),
('DST-0038','TRIP-2025-10-15-CMB','ST-CMB-01','08:30','08:50'),

('DST-0039','TRIP-2025-10-17-NGO','ST-KDY-01','05:40','06:00'),
('DST-0040','TRIP-2025-10-17-NGO','ST-NGO-01','08:00','08:15'),

('DST-0041','TRIP-2025-10-19-MAT','ST-KDY-01','05:40','06:00'),
('DST-0042','TRIP-2025-10-19-MAT','ST-MAT-01','10:30','10:45'),

('DST-0043','TRIP-2025-10-25-CMB','ST-KDY-01','05:40','06:00'),
('DST-0044','TRIP-2025-10-25-CMB','ST-CMB-01','08:30','08:50'),

('DST-0045','TRIP-2025-10-27-GAL','ST-KDY-01','05:40','06:00'),
('DST-0046','TRIP-2025-10-27-GAL','ST-GAL-01','09:40','10:00'),

('DST-0047','TRIP-2025-10-29-JAF','ST-KDY-01','05:10','05:30'),
('DST-0048','TRIP-2025-10-29-JAF','ST-JAF-01','12:05','12:25');

-- =========================
-- Routing (10 routes minimum)
-- =========================
INSERT INTO truck_routes (route_id, truck_id, end_location, distance_km, start_location) VALUES
('R-0001','TRK-001','Colombo 11 (Pettah Wholesale)', 8.50,'ST-CMB-01'),
('R-0002','TRK-007','Colombo 05 (Thimbirigasyaya)',12.20,'ST-CMB-01'),
('R-0003','TRK-002','Negombo Kochchikade', 18.30,'ST-NGO-01'),
('R-0004','TRK-008','Negombo Katana', 14.10,'ST-NGO-01'),
('R-0005','TRK-003','Galle Unawatuna', 7.80,'ST-GAL-01'),
('R-0006','TRK-009','Galle Hikkaduwa', 18.90,'ST-GAL-01'),
('R-0007','TRK-004','Matara Weligama', 20.10,'ST-MAT-01'),
('R-0008','TRK-010','Matara Hakmana', 16.70,'ST-MAT-01'),
('R-0009','TRK-005','Jaffna Nallur', 6.40,'ST-JAF-01'),
('R-0010','TRK-006','Trinco Uppuveli', 6.90,'ST-TRI-01');

-- =========================
-- Products
-- =========================
INSERT INTO products (product_id, product_name, unit_price, space_consumption_rate, stock_quantity, order_per_quarter) VALUES
('PRD-DET-1KG','Detergent 1kg', 850.00,0.50, 1200, 900),
('PRD-SHP-500','Shampoo 500ml', 950.00,0.30, 1500, 1100),
('PRD-SOAP-100','Bath Soap 100g', 180.00,0.10, 5000, 4200),
('PRD-TP-120','Toothpaste 120g', 320.00,0.12, 3000, 2100),
('PRD-TEA-200','Ceylon Tea 200g', 700.00,0.25, 2200, 1600),
('PRD-MLK-1L','UHT Milk 1L', 380.00,0.40, 2400, 1800),
('PRD-BIS-200','Biscuits 200g', 250.00,0.15, 4000, 3000),
('PRD-CLR-1L','Floor Cleaner 1L', 620.00,0.35, 1300, 900),
('PRD-OFK-5L','Cooking Oil 5L', 2200.00,0.80, 800, 500),
('PRD-RIC-10','Rice 10kg', 1500.00,1.20, 900, 600);

-- =========================
-- Customers
-- Test Customer Accounts:
-- Customer 1: email='sunrise.wholesale@shop.lk', password='password123'
-- Customer 2: email='pettah.mart@shop.lk', password='password123'
-- =========================
INSERT INTO customers (customer_id, email, phone_number, city, name, password) VALUES
('CUST-0001','sunrise.wholesale@shop.lk','+94-11-2345678','Colombo','Sunrise Wholesale','$2b$10$LLUv.hPs6q..X8qReXuzjuK.CX7BMuxldJZhN9biPpR7AJiwSp6yC'),
('CUST-0002','pettah.mart@shop.lk','+94-11-2233445','Colombo','Pettah Mart','$2b$10$LLUv.hPs6q..X8qReXuzjuK.CX7BMuxldJZhN9biPpR7AJiwSp6yC');

-- =========================
-- Orders (40 orders across Q3–Q4 2025)
-- status: PLACED / SCHEDULED / DELIVERED
-- =========================
INSERT INTO orders (order_id, customer_id, store_id, route_id, ordered_date, total_price, status) VALUES
-- August Orders
('ORD-0001','CUST-0001','ST-CMB-01','R-0001','2025-08-01',  24300.00,'DELIVERED'),
('ORD-0002','CUST-0002','ST-CMB-01','R-0001','2025-08-02',  19850.00,'DELIVERED'),
('ORD-0003','CUST-0003','ST-NGO-01','R-0003','2025-08-03',   9600.00,'DELIVERED'),
('ORD-0004','CUST-0004','ST-NGO-01','R-0004','2025-08-04',  14150.00,'DELIVERED'),
('ORD-0005','CUST-0005','ST-GAL-01','R-0005','2025-08-05',  22000.00,'DELIVERED'),
('ORD-0006','CUST-0006','ST-GAL-01','R-0006','2025-08-06',   6700.00,'DELIVERED'),
('ORD-0007','CUST-0007','ST-MAT-01','R-0007','2025-08-07',  11900.00,'DELIVERED'),
('ORD-0008','CUST-0008','ST-MAT-01','R-0008','2025-08-08',   9980.00,'DELIVERED'),
('ORD-0009','CUST-0009','ST-JAF-01','R-0009','2025-08-09',  13450.00,'DELIVERED'),
('ORD-0010','CUST-0010','ST-TRI-01','R-0010','2025-08-10',   7850.00,'DELIVERED'),
('ORD-0011','CUST-0011','ST-CMB-01','R-0002','2025-08-15',   8250.00,'DELIVERED'),
('ORD-0012','CUST-0012','ST-NGO-01','R-0003','2025-08-16',   9400.00,'DELIVERED'),
('ORD-0013','CUST-0013','ST-GAL-01','R-0005','2025-08-17',  11000.00,'DELIVERED'),
('ORD-0014','CUST-0014','ST-MAT-01','R-0007','2025-08-18',   5200.00,'DELIVERED'),
('ORD-0015','CUST-0015','ST-TRI-01','R-0010','2025-08-19',  24600.00,'DELIVERED'),

-- September Orders
('ORD-0016','CUST-0001','ST-CMB-01','R-0001','2025-09-01',   8350.00,'DELIVERED'),
('ORD-0017','CUST-0002','ST-CMB-01','R-0002','2025-09-02',  10250.00,'DELIVERED'),
('ORD-0018','CUST-0003','ST-NGO-01','R-0003','2025-09-03',   9100.00,'DELIVERED'),
('ORD-0019','CUST-0004','ST-NGO-01','R-0004','2025-09-04',  15750.00,'DELIVERED'),
('ORD-0020','CUST-0005','ST-GAL-01','R-0005','2025-09-05',   5800.00,'DELIVERED'),
('ORD-0021','CUST-0006','ST-GAL-01','R-0006','2025-09-06',   7450.00,'DELIVERED'),
('ORD-0022','CUST-0007','ST-MAT-01','R-0007','2025-09-07',  12000.00,'DELIVERED'),
('ORD-0023','CUST-0008','ST-MAT-01','R-0008','2025-09-08',   8300.00,'DELIVERED'),
('ORD-0024','CUST-0009','ST-JAF-01','R-0009','2025-09-09',   6000.00,'DELIVERED'),
('ORD-0025','CUST-0010','ST-TRI-01','R-0010','2025-09-10',  19900.00,'DELIVERED'),
('ORD-0026','CUST-0011','ST-CMB-01','R-0001','2025-09-15',   7700.00,'SCHEDULED'),
('ORD-0027','CUST-0012','ST-NGO-01','R-0003','2025-09-16',   9600.00,'SCHEDULED'),
('ORD-0028','CUST-0013','ST-GAL-01','R-0005','2025-09-17',  10550.00,'SCHEDULED'),
('ORD-0029','CUST-0014','ST-MAT-01','R-0007','2025-09-18',  15200.00,'PLACED'),
('ORD-0030','CUST-0015','ST-TRI-01','R-0010','2025-09-19',   8200.00,'PLACED'),

-- October Orders
('ORD-0031','CUST-0001','ST-CMB-01','R-0001','2025-10-01',  22500.00,'DELIVERED'),
('ORD-0032','CUST-0002','ST-CMB-01','R-0002','2025-10-01',  18750.00,'DELIVERED'),
('ORD-0033','CUST-0003','ST-NGO-01','R-0003','2025-10-02',  12400.00,'DELIVERED'),
('ORD-0034','CUST-0004','ST-NGO-01','R-0004','2025-10-02',   9800.00,'DELIVERED'),
('ORD-0035','CUST-0005','ST-GAL-01','R-0005','2025-10-03',  16500.00,'DELIVERED'),
('ORD-0036','CUST-0006','ST-GAL-01','R-0006','2025-10-03',  11200.00,'DELIVERED'),
('ORD-0037','CUST-0007','ST-MAT-01','R-0007','2025-10-04',  13600.00,'DELIVERED'),
('ORD-0038','CUST-0008','ST-MAT-01','R-0008','2025-10-04',   8900.00,'DELIVERED'),
('ORD-0039','CUST-0009','ST-JAF-01','R-0009','2025-10-05',  21300.00,'DELIVERED'),
('ORD-0040','CUST-0010','ST-TRI-01','R-0010','2025-10-05',  14700.00,'DELIVERED'),
('ORD-0041','CUST-0011','ST-CMB-01','R-0001','2025-10-08',  17800.00,'DELIVERED'),
('ORD-0042','CUST-0012','ST-NGO-01','R-0003','2025-10-09',  13200.00,'DELIVERED'),
('ORD-0043','CUST-0013','ST-GAL-01','R-0005','2025-10-10',   9400.00,'SCHEDULED'),
('ORD-0044','CUST-0014','ST-MAT-01','R-0007','2025-10-11',  12800.00,'SCHEDULED'),
('ORD-0045','CUST-0015','ST-TRI-01','R-0010','2025-10-12',  15600.00,'SCHEDULED'),
('ORD-0046','CUST-0001','ST-CMB-01','R-0002','2025-10-13',  19200.00,'SCHEDULED'),
('ORD-0047','CUST-0003','ST-NGO-01','R-0004','2025-10-14',  11500.00,'SCHEDULED'),
('ORD-0048','CUST-0005','ST-GAL-01','R-0006','2025-10-15',   8800.00,'PLACED'),
('ORD-0049','CUST-0007','ST-MAT-01','R-0008','2025-10-15',  14200.00,'PLACED'),
('ORD-0050','CUST-0009','ST-JAF-01','R-0009','2025-10-16',  16800.00,'PLACED'),
('ORD-0051','CUST-0010','ST-TRI-01','R-0010','2025-10-17',  20500.00,'PLACED'),
('ORD-0052','CUST-0002','ST-CMB-01','R-0001','2025-10-18',  15300.00,'PLACED'),
('ORD-0053','CUST-0004','ST-NGO-01','R-0003','2025-10-19',  10800.00,'PLACED'),
('ORD-0054','CUST-0006','ST-GAL-01','R-0005','2025-10-20',  18900.00,'PLACED'),
('ORD-0055','CUST-0008','ST-MAT-01','R-0007','2025-10-21',  13400.00,'PLACED'),
('ORD-0056','CUST-0011','ST-CMB-01','R-0002','2025-10-21',  22100.00,'PLACED'),
('ORD-0057','CUST-0012','ST-NGO-01','R-0004','2025-10-22',  16700.00,'PLACED'),
('ORD-0058','CUST-0013','ST-GAL-01','R-0006','2025-10-23',  12500.00,'PLACED'),
('ORD-0059','CUST-0014','ST-MAT-01','R-0008','2025-10-23',  19600.00,'PLACED'),
('ORD-0060','CUST-0015','ST-TRI-01','R-0010','2025-10-24',  14900.00,'PLACED'),
('ORD-0061','CUST-0001','ST-CMB-01','R-0001','2025-10-24',  11200.00,'PLACED'),
('ORD-0062','CUST-0003','ST-NGO-01','R-0003','2025-10-24',  17300.00,'PLACED'),
('ORD-0063','CUST-0005','ST-GAL-01','R-0005','2025-10-25',  13800.00,'PLACED'),
('ORD-0064','CUST-0007','ST-MAT-01','R-0007','2025-10-25',  16500.00,'PLACED'),
('ORD-0065','CUST-0009','ST-JAF-01','R-0009','2025-10-25',  19200.00,'PLACED'),
('ORD-0066','CUST-0010','ST-TRI-01','R-0010','2025-10-25',  14600.00,'PLACED'),
('ORD-0067','CUST-0002','ST-CMB-01','R-0002','2025-10-25',  21400.00,'PLACED'),
('ORD-0068','CUST-0004','ST-NGO-01','R-0004','2025-10-26',  12700.00,'PLACED'),
('ORD-0069','CUST-0006','ST-GAL-01','R-0006','2025-10-26',  15900.00,'PLACED'),
('ORD-0070','CUST-0008','ST-MAT-01','R-0008','2025-10-27',  18300.00,'PLACED');

-- =========================
-- Order items (mostly 2 items/order to keep it compact)
-- item_capacity kept simple as an integer proxy for space units consumed
-- =========================
INSERT INTO order_items (order_id, product_id, quantity, item_capacity, unit_price) VALUES
('ORD-0001','PRD-DET-1KG',10,5,850.00), ('ORD-0001','PRD-SOAP-100',50,5,180.00),
('ORD-0002','PRD-TP-120',20,3,320.00),  ('ORD-0002','PRD-BIS-200',10,2,250.00),
('ORD-0003','PRD-TEA-200',15,4,700.00), ('ORD-0003','PRD-DET-1KG',8,4,850.00),
('ORD-0004','PRD-SHP-500',6,2,950.00),  ('ORD-0004','PRD-MLK-1L',20,8,380.00),
('ORD-0005','PRD-OFK-5L',3,3,2200.00),  ('ORD-0005','PRD-SOAP-100',60,6,180.00),
('ORD-0006','PRD-CLR-1L',10,4,620.00),  ('ORD-0006','PRD-BIS-200',20,3,250.00),
('ORD-0007','PRD-RIC-10',8,10,1500.00), ('ORD-0007','PRD-TEA-200',10,3,700.00),
('ORD-0008','PRD-DET-1KG',5,3,850.00),  ('ORD-0008','PRD-TP-120',10,2,320.00),
('ORD-0009','PRD-SHP-500',8,3,950.00),  ('ORD-0009','PRD-SOAP-100',40,4,180.00),
('ORD-0010','PRD-MLK-1L',15,6,380.00),  ('ORD-0010','PRD-BIS-200',20,3,250.00),
('ORD-0011','PRD-DET-1KG',6,3,850.00),  ('ORD-0011','PRD-TP-120',10,2,320.00),
('ORD-0012','PRD-OFK-5L',5,5,2200.00),  ('ORD-0012','PRD-TEA-200',10,3,700.00),
('ORD-0013','PRD-BIS-200',30,5,250.00), ('ORD-0013','PRD-CLR-1L',8,3,620.00),
('ORD-0014','PRD-DET-1KG',12,6,850.00), ('ORD-0014','PRD-SHP-500',6,2,950.00),
('ORD-0015','PRD-RIC-10',12,15,1500.00),('ORD-0015','PRD-TEA-200',20,5,700.00),
('ORD-0016','PRD-MLK-1L',18,7,380.00),  ('ORD-0016','PRD-TP-120',15,3,320.00),
('ORD-0017','PRD-OFK-5L',4,4,2200.00),  ('ORD-0017','PRD-SOAP-100',80,8,180.00),
('ORD-0018','PRD-CLR-1L',12,5,620.00),  ('ORD-0018','PRD-BIS-200',25,4,250.00),
('ORD-0019','PRD-RIC-10',9,11,1500.00), ('ORD-0019','PRD-DET-1KG',10,5,850.00),
('ORD-0020','PRD-TEA-200',8,2,700.00),  ('ORD-0020','PRD-MLK-1L',12,5,380.00),
('ORD-0021','PRD-TP-120',18,3,320.00),  ('ORD-0021','PRD-BIS-200',18,3,250.00),
('ORD-0022','PRD-DET-1KG',14,7,850.00), ('ORD-0022','PRD-TEA-200',10,3,700.00),
('ORD-0023','PRD-SHP-500',5,2,950.00),  ('ORD-0023','PRD-MLK-1L',10,4,380.00),
('ORD-0024','PRD-BIS-200',40,6,250.00), ('ORD-0024','PRD-CLR-1L',10,4,620.00),
('ORD-0025','PRD-OFK-5L',3,3,2200.00),  ('ORD-0025','PRD-RIC-10',6,8,1500.00),
('ORD-0026','PRD-TEA-200',6,2,700.00),  ('ORD-0026','PRD-SOAP-100',50,5,180.00),
('ORD-0027','PRD-DET-1KG',15,8,850.00), ('ORD-0027','PRD-OFK-5L',4,4,2200.00),
('ORD-0028','PRD-TP-120',14,3,320.00),  ('ORD-0028','PRD-BIS-200',22,4,250.00),
('ORD-0029','PRD-CLR-1L',12,5,620.00),  ('ORD-0029','PRD-SHP-500',7,3,950.00),
('ORD-0030','PRD-RIC-10',7,9,1500.00),  ('ORD-0030','PRD-MLK-1L',14,6,380.00),
('ORD-0031','PRD-TEA-200',20,5,700.00), ('ORD-0031','PRD-SOAP-100',70,7,180.00),
('ORD-0032','PRD-TP-120',12,3,320.00),  ('ORD-0032','PRD-DET-1KG',6,3,850.00),
('ORD-0033','PRD-BIS-200',26,4,250.00), ('ORD-0033','PRD-MLK-1L',10,4,380.00),
('ORD-0034','PRD-SHP-500',10,4,950.00), ('ORD-0034','PRD-TEA-200',12,3,700.00),
('ORD-0035','PRD-CLR-1L',9,4,620.00),  ('ORD-0035','PRD-DET-1KG',8,4,850.00),
('ORD-0036','PRD-RIC-10',5,7,1500.00),  ('ORD-0036','PRD-SOAP-100',60,6,180.00),
('ORD-0037','PRD-OFK-5L',6,6,2200.00),  ('ORD-0037','PRD-TP-120',18,3,320.00),
('ORD-0038','PRD-BIS-200',24,4,250.00), ('ORD-0038','PRD-MLK-1L',12,5,380.00),
('ORD-0039','PRD-DET-1KG',9,5,850.00),  ('ORD-0039','PRD-TEA-200',10,3,700.00),
('ORD-0040','PRD-SHP-500',7,3,950.00),  ('ORD-0040','PRD-CLR-1L',8,3,620.00),
('ORD-0041','PRD-RIC-10',8,10,1500.00), ('ORD-0041','PRD-OFK-5L',3,3,2200.00),
('ORD-0042','PRD-DET-1KG',11,6,850.00), ('ORD-0042','PRD-SHP-500',5,2,950.00),
('ORD-0043','PRD-TP-120',16,3,320.00),  ('ORD-0043','PRD-BIS-200',18,3,250.00),
('ORD-0044','PRD-TEA-200',14,4,700.00), ('ORD-0044','PRD-CLR-1L',10,4,620.00),
('ORD-0045','PRD-MLK-1L',20,8,380.00),  ('ORD-0045','PRD-SOAP-100',60,6,180.00),
('ORD-0046','PRD-OFK-5L',4,4,2200.00),  ('ORD-0046','PRD-RIC-10',6,8,1500.00),
('ORD-0047','PRD-DET-1KG',8,4,850.00),  ('ORD-0047','PRD-TP-120',15,3,320.00),
('ORD-0048','PRD-BIS-200',22,4,250.00), ('ORD-0048','PRD-CLR-1L',7,3,620.00),
('ORD-0049','PRD-SHP-500',9,4,950.00),  ('ORD-0049','PRD-TEA-200',12,3,700.00),
('ORD-0050','PRD-RIC-10',9,11,1500.00), ('ORD-0050','PRD-DET-1KG',7,4,850.00),
('ORD-0051','PRD-OFK-5L',5,5,2200.00),  ('ORD-0051','PRD-MLK-1L',18,7,380.00),
('ORD-0052','PRD-TEA-200',16,4,700.00), ('ORD-0052','PRD-SOAP-100',50,5,180.00),
('ORD-0053','PRD-TP-120',20,4,320.00),  ('ORD-0053','PRD-BIS-200',20,3,250.00),
('ORD-0054','PRD-CLR-1L',11,5,620.00),  ('ORD-0054','PRD-DET-1KG',10,5,850.00),
('ORD-0055','PRD-SHP-500',8,3,950.00),  ('ORD-0055','PRD-MLK-1L',15,6,380.00),
('ORD-0056','PRD-RIC-10',10,12,1500.00),('ORD-0056','PRD-OFK-5L',4,4,2200.00),
('ORD-0057','PRD-DET-1KG',12,6,850.00), ('ORD-0057','PRD-TEA-200',10,3,700.00),
('ORD-0058','PRD-TP-120',18,3,320.00),  ('ORD-0058','PRD-BIS-200',25,4,250.00),
('ORD-0059','PRD-CLR-1L',13,5,620.00),  ('ORD-0059','PRD-SHP-500',10,4,950.00),
('ORD-0060','PRD-MLK-1L',16,7,380.00),  ('ORD-0060','PRD-SOAP-100',70,7,180.00),
('ORD-0061','PRD-DET-1KG',8,4,850.00),  ('ORD-0061','PRD-TP-120',10,2,320.00),
('ORD-0062','PRD-RIC-10',9,11,1500.00), ('ORD-0062','PRD-TEA-200',10,3,700.00),
('ORD-0063','PRD-CLR-1L',10,4,620.00),  ('ORD-0063','PRD-BIS-200',22,4,250.00),
('ORD-0064','PRD-OFK-5L',5,5,2200.00),  ('ORD-0064','PRD-MLK-1L',15,6,380.00),
('ORD-0065','PRD-DET-1KG',12,6,850.00), ('ORD-0065','PRD-SHP-500',8,3,950.00),
('ORD-0066','PRD-TP-120',16,3,320.00),  ('ORD-0066','PRD-SOAP-100',60,6,180.00),
('ORD-0067','PRD-RIC-10',11,13,1500.00),('ORD-0067','PRD-TEA-200',14,4,700.00),
('ORD-0068','PRD-BIS-200',28,5,250.00), ('ORD-0068','PRD-CLR-1L',9,4,620.00),
('ORD-0069','PRD-SHP-500',10,4,950.00), ('ORD-0069','PRD-MLK-1L',12,5,380.00),
('ORD-0070','PRD-DET-1KG',13,7,850.00), ('ORD-0070','PRD-OFK-5L',4,4,2200.00);

-- =========================
-- Delivery schedules (subset marked delivered)
-- =========================
INSERT INTO delivery_schedules (delivery_id, order_id, vehicle_id, delivered_date, vehicle_arrival_time, vehicle_departure_time, delivery_status) VALUES
-- August Deliveries
('DLV-0001','ORD-0001','VEH-001','2025-08-02','09:10:00','09:35:00',1),
('DLV-0002','ORD-0002','VEH-007','2025-08-03','10:00:00','10:20:00',1),
('DLV-0003','ORD-0003','VEH-002','2025-08-04','09:00:00','09:20:00',1),
('DLV-0004','ORD-0004','VEH-008','2025-08-05','10:15:00','10:30:00',1),
('DLV-0005','ORD-0005','VEH-003','2025-08-06','11:00:00','11:25:00',1),
('DLV-0006','ORD-0006','VEH-009','2025-08-07','09:40:00','09:55:00',1),
('DLV-0007','ORD-0007','VEH-004','2025-08-08','10:30:00','10:50:00',1),
('DLV-0008','ORD-0008','VEH-010','2025-08-09','09:20:00','09:35:00',1),
('DLV-0009','ORD-0009','VEH-005','2025-08-10','08:50:00','09:10:00',1),
('DLV-0010','ORD-0010','VEH-006','2025-08-11','09:15:00','09:35:00',1),
('DLV-0011','ORD-0011','VEH-001','2025-08-16','10:05:00','10:20:00',1),
('DLV-0012','ORD-0012','VEH-002','2025-08-17','09:15:00','09:40:00',1),
('DLV-0013','ORD-0013','VEH-003','2025-08-18','10:00:00','10:15:00',1),
('DLV-0014','ORD-0014','VEH-004','2025-08-19','09:30:00','09:55:00',1),
('DLV-0015','ORD-0015','VEH-006','2025-08-20','10:45:00','11:05:00',1),

-- September Deliveries
('DLV-0016','ORD-0016','VEH-001','2025-09-02','09:30:00','09:50:00',1),
('DLV-0017','ORD-0017','VEH-007','2025-09-03','11:10:00','11:25:00',1),
('DLV-0018','ORD-0018','VEH-002','2025-09-04','09:35:00','09:55:00',1),
('DLV-0019','ORD-0019','VEH-008','2025-09-05','10:00:00','10:20:00',1),
('DLV-0020','ORD-0020','VEH-003','2025-09-06','09:25:00','09:45:00',1),
('DLV-0021','ORD-0021','VEH-009','2025-09-07','10:10:00','10:30:00',1),
('DLV-0022','ORD-0022','VEH-004','2025-09-08','09:15:00','09:40:00',1),
('DLV-0023','ORD-0023','VEH-010','2025-09-09','10:00:00','10:15:00',1),
('DLV-0024','ORD-0024','VEH-005','2025-09-10','09:30:00','09:55:00',1),
('DLV-0025','ORD-0025','VEH-006','2025-09-11','10:45:00','11:05:00',1),
('DLV-0026','ORD-0026','VEH-001',NULL,NULL,NULL,0),
('DLV-0027','ORD-0027','VEH-002',NULL,NULL,NULL,0),
('DLV-0028','ORD-0028','VEH-003',NULL,NULL,NULL,0),
('DLV-0029','ORD-0029','VEH-004',NULL,NULL,NULL,0),
('DLV-0030','ORD-0030','VEH-006',NULL,NULL,NULL,0),

-- October Deliveries
('DLV-0031','ORD-0031','VEH-001','2025-10-02','09:20:00','09:45:00',1),
('DLV-0032','ORD-0032','VEH-007','2025-10-02','10:30:00','10:50:00',1),
('DLV-0033','ORD-0033','VEH-002','2025-10-03','09:10:00','09:30:00',1),
('DLV-0034','ORD-0034','VEH-008','2025-10-03','10:15:00','10:35:00',1),
('DLV-0035','ORD-0035','VEH-003','2025-10-04','11:00:00','11:25:00',1),
('DLV-0036','ORD-0036','VEH-009','2025-10-04','09:40:00','10:00:00',1),
('DLV-0037','ORD-0037','VEH-004','2025-10-05','10:30:00','10:55:00',1),
('DLV-0038','ORD-0038','VEH-010','2025-10-05','09:20:00','09:40:00',1),
('DLV-0039','ORD-0039','VEH-005','2025-10-06','08:50:00','09:15:00',1),
('DLV-0040','ORD-0040','VEH-006','2025-10-06','09:15:00','09:40:00',1),
('DLV-0041','ORD-0041','VEH-001','2025-10-09','10:00:00','10:25:00',1),
('DLV-0042','ORD-0042','VEH-002','2025-10-10','09:30:00','09:55:00',1),
('DLV-0043','ORD-0043','VEH-003','2025-10-18','10:00:00','10:20:00',0),
('DLV-0044','ORD-0044','VEH-004','2025-10-19','09:30:00','09:55:00',0),
('DLV-0045','ORD-0045','VEH-006','2025-10-20','10:45:00','11:10:00',0),
('DLV-0046','ORD-0046','VEH-001','2025-10-21','09:15:00','09:40:00',0),
('DLV-0047','ORD-0047','VEH-002','2025-10-22','10:00:00','10:25:00',0),
('DLV-0048','ORD-0048','VEH-003',NULL,NULL,NULL,0),
('DLV-0049','ORD-0049','VEH-004',NULL,NULL,NULL,0),
('DLV-0050','ORD-0050','VEH-005',NULL,NULL,NULL,0),
('DLV-0051','ORD-0051','VEH-006',NULL,NULL,NULL,0),
('DLV-0052','ORD-0052','VEH-001',NULL,NULL,NULL,0),
('DLV-0053','ORD-0053','VEH-002',NULL,NULL,NULL,0),
('DLV-0054','ORD-0054','VEH-003',NULL,NULL,NULL,0),
('DLV-0055','ORD-0055','VEH-004',NULL,NULL,NULL,0),
('DLV-0056','ORD-0056','VEH-007',NULL,NULL,NULL,0),
('DLV-0057','ORD-0057','VEH-008',NULL,NULL,NULL,0),
('DLV-0058','ORD-0058','VEH-009',NULL,NULL,NULL,0),
('DLV-0059','ORD-0059','VEH-010',NULL,NULL,NULL,0),
('DLV-0060','ORD-0060','VEH-006',NULL,NULL,NULL,0);

-- =========================
-- Users & Roles
-- Test Accounts for Login System
-- Admin: username='admin', password='admin123'
-- Store Manager: username='john_doe', password='password123'
-- Delivery Employee: username='jane_smith', password='password123'
-- =========================
INSERT INTO users (user_id, store_id, name, password, designation, is_employed) VALUES
('USR-001','ST-CMB-01','john_doe','$2b$10$LLUv.hPs6q..X8qReXuzjuK.CX7BMuxldJZhN9biPpR7AJiwSp6yC','Store Manager',1),
('USR-002','ST-KDY-01','jane_smith','$2b$10$LLUv.hPs6q..X8qReXuzjuK.CX7BMuxldJZhN9biPpR7AJiwSp6yC','Delivery Driver',1),
('USR-ADM-01',NULL,'System Admin','$2y$dummyhash','Admin',1),
('USR-MGR-KDY','ST-KDY-01','Anura Perera','$2y$dummyhash','Store Manager',1),
('USR-MGR-CMB','ST-CMB-01','Rashmi De Silva','$2y$dummyhash','Store Manager',1),
('USR-DRV-01','ST-CMB-01','Kumara Jayasuriya','$2y$dummyhash','Driver',1),
('USR-DRV-02','ST-NGO-01','Sujeewa Fernando','$2y$dummyhash','Driver',1),
('USR-DRV-03','ST-GAL-01','Isuru Weerasekara','$2y$dummyhash','Driver',1),
('USR-ASS-01','ST-CMB-01','Nadeesha Karu','$2y$dummyhash','Assistant',1),
('USR-ASS-02','ST-NGO-01','Ruwan Perera','$2y$dummyhash','Assistant',1);

INSERT INTO store_managers (manager_id) VALUES
('USR-001'),
('USR-MGR-KDY'),
('USR-MGR-CMB');

INSERT INTO delivery_employees (user_id, working_hours, availability) VALUES
('USR-002','08:00-17:00',1),
('USR-DRV-01','Mon–Fri 08:00–17:00',1),
('USR-DRV-02','Tue–Sat 08:00–17:00',1),
('USR-DRV-03','Mon–Fri 09:00–18:00',1),
('USR-ASS-01','Mon–Sat 08:00–16:00',1),
('USR-ASS-02','Tue–Sat 09:00–17:00',1);

INSERT INTO admins (admin_id, username, email, password) VALUES
('ADM-001','admin','admin@supplychain.com','$2b$10$ZIoWAw1nygtyfc.uOA5EmueiUSJZOe644H/4K8PN7yzIkefppk4lC'),
('ADM-ROOT','root','root@kandypack.lk','$2y$dummyhash');


SET FOREIGN_KEY_CHECKS = 1;
