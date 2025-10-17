SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET time_zone = '+00:00';

-- =========================
-- AUTHENTICATION TEST CREDENTIALS
-- =========================
-- CUSTOMER LOGIN:
--   Email: sunrise.wholesale@shop.lk (or any customer email)
--   Password: password123
--
-- EMPLOYEE LOGIN:
--   User ID: USR-DRV-01 (Driver)
--   User ID: USR-MGR-CMB (Store Manager)
--   User ID: USR-MGR-MAIN (Main Store Manager)
--   Password: emp123 (for all employees)
-- =========================

CREATE DATABASE IF NOT EXISTS `supplychain`;
USE `supplychain`;

-- =========================
-- Core reference tables
-- =========================
CREATE TABLE IF NOT EXISTS stores (
  store_id        VARCHAR(255) PRIMARY KEY,
  city            VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sub_cities (
  sub_city_id     VARCHAR(255) PRIMARY KEY,
  sub_city_name   VARCHAR(255),
  store_id        VARCHAR(255),
  CONSTRAINT fk_sub_cities_store
    FOREIGN KEY (store_id) REFERENCES stores(store_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS trains (
  train_id        VARCHAR(255) PRIMARY KEY,
  train_name      VARCHAR(255),
  capacity        DECIMAL(10,2)                  -- cargo capacity in cubic meters or tons
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS trucks (
  truck_id        VARCHAR(255) PRIMARY KEY,
  store_id        VARCHAR(255),
  reg_number      VARCHAR(255),                  -- unique vehicle registration
  capacity        DECIMAL(10,2),                 -- cargo capacity in cubic meters or tons
  used_hours      DECIMAL(6,2),
  availability    TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT uq_trucks_reg UNIQUE (reg_number),
  CONSTRAINT fk_trucks_store
    FOREIGN KEY (store_id) REFERENCES stores(store_id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================
-- Train operations
-- =========================
CREATE TABLE IF NOT EXISTS train_schedules (
  trip_id          VARCHAR(255) PRIMARY KEY,
  day_date         DATE,
  start_time       TIME,
  arrival_time     TIME,
  train_id         VARCHAR(255),
  end_store_id     VARCHAR(255),
  available_capacity DECIMAL(10,2) DEFAULT 0,
  CONSTRAINT fk_ts_train
    FOREIGN KEY (train_id) REFERENCES trains(train_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_ts_end_store
    FOREIGN KEY (end_store_id) REFERENCES stores(store_id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- Junction table to track which orders are assigned to which train schedules
CREATE TABLE IF NOT EXISTS train_schedule_orders (
  trip_id        VARCHAR(255),
  order_id       VARCHAR(255),
  assigned_date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (trip_id, order_id),
  CONSTRAINT fk_tso_trip
    FOREIGN KEY (trip_id) REFERENCES train_schedules(trip_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_tso_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON UPDATE CASCADE ON DELETE CASCADE
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
  password        VARCHAR(255),
  phone_number    VARCHAR(32),                    -- ERD shows int; using VARCHAR is safer
  city            VARCHAR(255),
  name            VARCHAR(255),
  CONSTRAINT uq_customers_email UNIQUE (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  order_id        VARCHAR(255) PRIMARY KEY,
  customer_id     VARCHAR(255),
  store_id        VARCHAR(255),
  sub_city_id     VARCHAR(255),
  ordered_date    DATE,
  total_price     DECIMAL(8,2),
  status          VARCHAR(255),
  truck_id        VARCHAR(255),
  driver_id       VARCHAR(255),
  assistant_id    VARCHAR(255),
  KEY idx_orders_customer (customer_id),
  KEY idx_orders_store (store_id),
  KEY idx_orders_sub_city (sub_city_id),
  KEY idx_orders_truck (truck_id),
  KEY idx_orders_driver (driver_id),
  KEY idx_orders_assistant (assistant_id),
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_orders_store
    FOREIGN KEY (store_id) REFERENCES stores(store_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_orders_sub_city
    FOREIGN KEY (sub_city_id) REFERENCES sub_cities(sub_city_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_orders_truck
    FOREIGN KEY (truck_id) REFERENCES trucks(truck_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_orders_driver
    FOREIGN KEY (driver_id) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_orders_assistant
    FOREIGN KEY (assistant_id) REFERENCES users(user_id)
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
INSERT INTO stores (store_id, city) VALUES
('ST-CMB-01','Colombo'),
('ST-NGO-01','Negombo'),
('ST-GAL-01','Galle'),
('ST-MAT-01','Matara'),
('ST-JAF-01','Jaffna'),
('ST-TRI-01','Trincomalee');

INSERT INTO sub_cities (sub_city_id, sub_city_name, store_id) VALUES
-- Colombo sub-cities
('SC-CMB-001','Pettah','ST-CMB-01'),
('SC-CMB-002','Thimbirigasyaya','ST-CMB-01'),
('SC-CMB-003','Dehiwala','ST-CMB-01'),
-- Negombo sub-cities
('SC-NGO-001','Kochchikade','ST-NGO-01'),
('SC-NGO-002','Katana','ST-NGO-01'),
('SC-NGO-003','Wattala','ST-NGO-01'),
-- Galle sub-cities
('SC-GAL-001','Unawatuna','ST-GAL-01'),
('SC-GAL-002','Hikkaduwa','ST-GAL-01'),
('SC-GAL-003','Ambalangoda','ST-GAL-01'),
-- Matara sub-cities
('SC-MAT-001','Weligama','ST-MAT-01'),
('SC-MAT-002','Hakmana','ST-MAT-01'),
('SC-MAT-003','Dikwella','ST-MAT-01'),
-- Jaffna sub-cities
('SC-JAF-001','Nallur','ST-JAF-01'),
('SC-JAF-002','Chavakachcheri','ST-JAF-01'),
('SC-JAF-003','Point Pedro','ST-JAF-01'),
-- Trincomalee sub-cities
('SC-TRI-001','Uppuveli','ST-TRI-01'),
('SC-TRI-002','Nilaveli','ST-TRI-01'),
('SC-TRI-003','Kinniya','ST-TRI-01');

INSERT INTO trains (train_id, train_name, capacity) VALUES
('TRN-UD1','Udarata Cargo 1', 500.00),
('TRN-UD2','Udarata Cargo 2', 500.00),
('TRN-CST','Coastal Cargo', 450.00),
('TRN-CST2','Coastal Express', 450.00),
('TRN-NOR','Northern Cargo', 400.00),
('TRN-EAS','Eastern Cargo', 400.00);

INSERT INTO trucks (truck_id, store_id, reg_number, capacity, used_hours, availability) VALUES
('TRK-001','ST-CMB-01','WP-NA-1234', 50.00, 812.50,1),
('TRK-002','ST-NGO-01','WP-KK-5678', 45.00, 420.00,1),
('TRK-003','ST-GAL-01','SP-PA-2345', 45.00, 355.75,1),
('TRK-004','ST-MAT-01','SP-KM-9876', 50.00, 602.30,1),
('TRK-005','ST-JAF-01','NP-GH-1122', 40.00, 190.00,1),
('TRK-006','ST-TRI-01','EP-TR-3344', 40.00, 260.50,1),
('TRK-007','ST-CMB-01','WP-CB-8899', 50.00, 120.00,1),
('TRK-008','ST-NGO-01','WP-NG-6611', 45.00, 205.90,1),
('TRK-009','ST-GAL-01','SP-GL-7788', 45.00, 410.25,1),
('TRK-010','ST-MAT-01','SP-MT-4455', 40.00, 140.60,1);

-- =========================
-- Train operations
-- =========================
INSERT INTO train_schedules (trip_id, day_date, start_time, arrival_time, train_id, end_store_id, available_capacity) VALUES
-- Week of Oct 20-26, 2025
('TRIP-2025-10-20-CMB','2025-10-20','06:00:00','08:30:00','TRN-UD1','ST-CMB-01', 500.00),
('TRIP-2025-10-21-NGO','2025-10-21','06:00:00','08:00:00','TRN-UD2','ST-NGO-01', 500.00),
('TRIP-2025-10-22-GAL','2025-10-22','06:00:00','09:40:00','TRN-CST','ST-GAL-01', 450.00),
('TRIP-2025-10-23-MAT','2025-10-23','06:00:00','10:30:00','TRN-CST2','ST-MAT-01', 450.00),
('TRIP-2025-10-24-JAF','2025-10-24','05:30:00','12:05:00','TRN-NOR','ST-JAF-01', 400.00),
('TRIP-2025-10-25-TRI','2025-10-25','05:30:00','11:25:00','TRN-EAS','ST-TRI-01', 400.00),
('TRIP-2025-10-26-CMB','2025-10-26','06:00:00','08:30:00','TRN-UD1','ST-CMB-01', 500.00),

-- Week of Oct 27 - Nov 2, 2025
('TRIP-2025-10-27-NGO','2025-10-27','06:00:00','08:00:00','TRN-UD2','ST-NGO-01', 500.00),
('TRIP-2025-10-28-GAL','2025-10-28','06:00:00','09:40:00','TRN-CST','ST-GAL-01', 450.00),
('TRIP-2025-10-29-MAT','2025-10-29','06:00:00','10:30:00','TRN-CST2','ST-MAT-01', 450.00),
('TRIP-2025-10-30-JAF','2025-10-30','05:30:00','12:05:00','TRN-NOR','ST-JAF-01', 400.00),
('TRIP-2025-10-31-TRI','2025-10-31','05:30:00','11:25:00','TRN-EAS','ST-TRI-01', 400.00),
('TRIP-2025-11-01-CMB','2025-11-01','06:00:00','08:30:00','TRN-UD1','ST-CMB-01', 500.00),
('TRIP-2025-11-02-NGO','2025-11-02','06:00:00','08:00:00','TRN-UD2','ST-NGO-01', 500.00),

-- Week of Nov 3-9, 2025
('TRIP-2025-11-03-GAL','2025-11-03','06:00:00','09:40:00','TRN-CST','ST-GAL-01', 450.00),
('TRIP-2025-11-04-MAT','2025-11-04','06:00:00','10:30:00','TRN-CST2','ST-MAT-01', 450.00),
('TRIP-2025-11-05-JAF','2025-11-05','05:30:00','12:05:00','TRN-NOR','ST-JAF-01', 400.00),
('TRIP-2025-11-06-TRI','2025-11-06','05:30:00','11:25:00','TRN-EAS','ST-TRI-01', 400.00),
('TRIP-2025-11-07-CMB','2025-11-07','06:00:00','08:30:00','TRN-UD1','ST-CMB-01', 500.00),
('TRIP-2025-11-08-NGO','2025-11-08','06:00:00','08:00:00','TRN-UD2','ST-NGO-01', 500.00),
('TRIP-2025-11-09-GAL','2025-11-09','06:00:00','09:40:00','TRN-CST','ST-GAL-01', 450.00),

-- Nov 10, 2025
('TRIP-2025-11-10-MAT','2025-11-10','06:00:00','10:30:00','TRN-CST2','ST-MAT-01', 450.00);

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
-- =========================
-- Sample customers with passwords (password: 'password123' for all)
INSERT INTO customers (customer_id, email, password, phone_number, city, name) VALUES
('CUST-0001','sunrise.wholesale@shop.lk','password123','+94-11-2345678','Colombo','Sunrise Wholesale'),
('CUST-0002','pettah.mart@shop.lk','password123','+94-11-2233445','Colombo','Pettah Mart'),
('CUST-0003','negombo.grocers@shop.lk','password123','+94-31-2228888','Negombo','Negombo Grocers'),
('CUST-0004','kochchikade.store@shop.lk','password123','+94-31-2288999','Negombo','Kochchikade Store'),
('CUST-0005','galle.rampart@shop.lk','password123','+94-91-2244556','Galle','Rampart Super'),
('CUST-0006','unawatuna.mini@shop.lk','password123','+94-91-2255667','Galle','Unawatuna Mini Mart'),
('CUST-0007','matara.center@shop.lk','password123','+94-41-2233445','Matara','Matara Center'),
('CUST-0008','weligama.fooda@shop.lk','password123','+94-41-2277889','Matara','Fooda Weligama'),
('CUST-0009','jaffna.corner@shop.lk','password123','+94-21-2233001','Jaffna','Nallur Corner'),
('CUST-0010','trinco.breeze@shop.lk','password123','+94-26-2233556','Trincomalee','Breeze Stores'),
('CUST-0011','thimbiri.mini@shop.lk','password123','+94-11-2555000','Colombo','Thimbiri Mini Mart'),
('CUST-0012','katana.shop@shop.lk','password123','+94-31-2999000','Negombo','Katana Shop'),
('CUST-0013','hikka.foodcity@shop.lk','password123','+94-91-2777000','Galle','Hikka Food City'),
('CUST-0014','hakmana.bargain@shop.lk','password123','+94-41-2455000','Matara','Hakmana Bargain'),
('CUST-0015','uppuveli.seaside@shop.lk','password123','+94-26-2777333','Trincomalee','Uppuveli Seaside');

-- =========================
-- Orders (40 orders across Q3–Q4 2025)
-- status: PENDING / SCHEDULED / DELIVERED
-- =========================
INSERT INTO orders (order_id, customer_id, store_id, sub_city_id, ordered_date, total_price, status) VALUES
-- August Orders
('ORD-0001','CUST-0001','ST-CMB-01','SC-CMB-001','2025-08-01',  24300.00,'DELIVERED'),
('ORD-0002','CUST-0002','ST-CMB-01','SC-CMB-001','2025-08-02',  19850.00,'DELIVERED'),
('ORD-0003','CUST-0003','ST-NGO-01','SC-NGO-001','2025-08-03',   9600.00,'DELIVERED'),
('ORD-0004','CUST-0004','ST-NGO-01','SC-NGO-001','2025-08-04',  14150.00,'DELIVERED'),
('ORD-0005','CUST-0005','ST-GAL-01','SC-GAL-001','2025-08-05',  22000.00,'DELIVERED'),
('ORD-0006','CUST-0006','ST-GAL-01','SC-GAL-001','2025-08-06',   6700.00,'DELIVERED'),
('ORD-0007','CUST-0007','ST-MAT-01','SC-MAT-001','2025-08-07',  11900.00,'DELIVERED'),
('ORD-0008','CUST-0008','ST-MAT-01','SC-MAT-001','2025-08-08',   9980.00,'DELIVERED'),
('ORD-0009','CUST-0009','ST-JAF-01','SC-JAF-001','2025-08-09',  13450.00,'DELIVERED'),
('ORD-0010','CUST-0010','ST-TRI-01','SC-TRI-001','2025-08-10',   7850.00,'DELIVERED'),
('ORD-0011','CUST-0011','ST-CMB-01','SC-CMB-002','2025-08-15',   8250.00,'DELIVERED'),
('ORD-0012','CUST-0012','ST-NGO-01','SC-NGO-002','2025-08-16',   9400.00,'DELIVERED'),
('ORD-0013','CUST-0013','ST-GAL-01','SC-GAL-002','2025-08-17',  11000.00,'DELIVERED'),
('ORD-0014','CUST-0014','ST-MAT-01','SC-MAT-002','2025-08-18',   5200.00,'DELIVERED'),
('ORD-0015','CUST-0015','ST-TRI-01','SC-TRI-001','2025-08-19',  24600.00,'DELIVERED'),

-- September Orders
('ORD-0016','CUST-0001','ST-CMB-01','SC-CMB-001','2025-09-01',   8350.00,'DELIVERED'),
('ORD-0017','CUST-0002','ST-CMB-01','SC-CMB-001','2025-09-02',  10250.00,'DELIVERED'),
('ORD-0018','CUST-0003','ST-NGO-01','SC-NGO-001','2025-09-03',   9100.00,'DELIVERED'),
('ORD-0019','CUST-0004','ST-NGO-01','SC-NGO-001','2025-09-04',  15750.00,'DELIVERED'),
('ORD-0020','CUST-0005','ST-GAL-01','SC-GAL-001','2025-09-05',   5800.00,'DELIVERED'),
('ORD-0021','CUST-0006','ST-GAL-01','SC-GAL-001','2025-09-06',   7450.00,'DELIVERED'),
('ORD-0022','CUST-0007','ST-MAT-01','SC-MAT-001','2025-09-07',  12000.00,'DELIVERED'),
('ORD-0023','CUST-0008','ST-MAT-01','SC-MAT-001','2025-09-08',   8300.00,'DELIVERED'),
('ORD-0024','CUST-0009','ST-JAF-01','SC-JAF-001','2025-09-09',   6000.00,'DELIVERED'),
('ORD-0025','CUST-0010','ST-TRI-01','SC-TRI-001','2025-09-10',  19900.00,'DELIVERED'),
('ORD-0026','CUST-0011','ST-CMB-01','SC-CMB-002','2025-09-15',   7700.00,'SCHEDULED'),
('ORD-0027','CUST-0012','ST-NGO-01','SC-NGO-002','2025-09-16',   9600.00,'SCHEDULED'),
('ORD-0028','CUST-0013','ST-GAL-01','SC-GAL-002','2025-09-17',  10550.00,'SCHEDULED'),
('ORD-0029','CUST-0014','ST-MAT-01','SC-MAT-002','2025-09-18',  15200.00,'PENDING'),
('ORD-0030','CUST-0015','ST-TRI-01','SC-TRI-001','2025-09-19',   8200.00,'PENDING'),

-- October Orders
('ORD-0031','CUST-0001','ST-CMB-01','SC-CMB-001','2025-10-01',  22500.00,'DELIVERED'),
('ORD-0032','CUST-0002','ST-CMB-01','SC-CMB-001','2025-10-01',  18750.00,'DELIVERED'),
('ORD-0033','CUST-0003','ST-NGO-01','SC-NGO-001','2025-10-02',  12400.00,'DELIVERED'),
('ORD-0034','CUST-0004','ST-NGO-01','SC-NGO-001','2025-10-02',   9800.00,'DELIVERED'),
('ORD-0035','CUST-0005','ST-GAL-01','SC-GAL-001','2025-10-03',  16500.00,'DELIVERED'),
('ORD-0036','CUST-0006','ST-GAL-01','SC-GAL-001','2025-10-03',  11200.00,'DELIVERED'),
('ORD-0037','CUST-0007','ST-MAT-01','SC-MAT-001','2025-10-04',  13600.00,'DELIVERED'),
('ORD-0038','CUST-0008','ST-MAT-01','SC-MAT-001','2025-10-04',   8900.00,'DELIVERED'),
('ORD-0039','CUST-0009','ST-JAF-01','SC-JAF-001','2025-10-05',  21300.00,'DELIVERED'),
('ORD-0040','CUST-0010','ST-TRI-01','SC-TRI-001','2025-10-05',  14700.00,'DELIVERED'),
('ORD-0041','CUST-0011','ST-CMB-01','SC-CMB-002','2025-10-08',  17800.00,'DELIVERED'),
('ORD-0042','CUST-0012','ST-NGO-01','SC-NGO-002','2025-10-09',  13200.00,'DELIVERED'),
('ORD-0043','CUST-0013','ST-GAL-01','SC-GAL-002','2025-10-10',   9400.00,'SCHEDULED'),
('ORD-0044','CUST-0014','ST-MAT-01','SC-MAT-002','2025-10-11',  12800.00,'SCHEDULED'),
('ORD-0045','CUST-0015','ST-TRI-01','SC-TRI-001','2025-10-12',  15600.00,'SCHEDULED'),
('ORD-0046','CUST-0001','ST-CMB-01','SC-CMB-001','2025-10-13',  19200.00,'SCHEDULED'),
('ORD-0047','CUST-0003','ST-NGO-01','SC-NGO-001','2025-10-14',  11500.00,'SCHEDULED'),
('ORD-0048','CUST-0005','ST-GAL-01','SC-GAL-001','2025-10-15',   8800.00,'PENDING'),
('ORD-0049','CUST-0007','ST-MAT-01','SC-MAT-001','2025-10-15',  14200.00,'PENDING'),
('ORD-0050','CUST-0009','ST-JAF-01','SC-JAF-001','2025-10-16',  16800.00,'PENDING'),
('ORD-0051','CUST-0010','ST-TRI-01','SC-TRI-001','2025-10-17',  20500.00,'PENDING'),
('ORD-0052','CUST-0002','ST-CMB-01','SC-CMB-001','2025-10-18',  15300.00,'PENDING'),
('ORD-0053','CUST-0004','ST-NGO-01','SC-NGO-001','2025-10-19',  10800.00,'PENDING'),
('ORD-0054','CUST-0006','ST-GAL-01','SC-GAL-001','2025-10-20',  18900.00,'PENDING'),
('ORD-0055','CUST-0008','ST-MAT-01','SC-MAT-001','2025-10-21',  13400.00,'PENDING'),
('ORD-0056','CUST-0011','ST-CMB-01','SC-CMB-002','2025-10-21',  22100.00,'PENDING'),
('ORD-0057','CUST-0012','ST-NGO-01','SC-NGO-002','2025-10-22',  16700.00,'PENDING'),
('ORD-0058','CUST-0013','ST-GAL-01','SC-GAL-002','2025-10-23',  12500.00,'PENDING'),
('ORD-0059','CUST-0014','ST-MAT-01','SC-MAT-002','2025-10-23',  19600.00,'PENDING'),
('ORD-0060','CUST-0015','ST-TRI-01','SC-TRI-001','2025-10-24',  14900.00,'PENDING'),
('ORD-0061','CUST-0001','ST-CMB-01','SC-CMB-001','2025-10-24',  11200.00,'PENDING'),
('ORD-0062','CUST-0003','ST-NGO-01','SC-NGO-001','2025-10-24',  17300.00,'PENDING'),
('ORD-0063','CUST-0005','ST-GAL-01','SC-GAL-001','2025-10-25',  13800.00,'PENDING'),
('ORD-0064','CUST-0007','ST-MAT-01','SC-MAT-001','2025-10-25',  16500.00,'PENDING'),
('ORD-0065','CUST-0009','ST-JAF-01','SC-JAF-001','2025-10-25',  19200.00,'PENDING'),
('ORD-0066','CUST-0010','ST-TRI-01','SC-TRI-001','2025-10-25',  14600.00,'PENDING'),
('ORD-0067','CUST-0002','ST-CMB-01','SC-CMB-001','2025-10-25',  21400.00,'PENDING'),
('ORD-0068','CUST-0004','ST-NGO-01','SC-NGO-001','2025-10-26',  12700.00,'PENDING'),
('ORD-0069','CUST-0006','ST-GAL-01','SC-GAL-001','2025-10-26',  15900.00,'PENDING'),
('ORD-0070','CUST-0008','ST-MAT-01','SC-MAT-001','2025-10-27',  18300.00,'PENDING'),

-- Sample orders with TRAIN status for Store Manager testing (CMB Store)
('ORD-0071','CUST-0001','ST-CMB-01','SC-CMB-001','2025-10-15',  24500.00,'TRAIN'),
('ORD-0072','CUST-0002','ST-CMB-01','SC-CMB-002','2025-10-16',  18900.00,'TRAIN'),
('ORD-0073','CUST-0011','ST-CMB-01','SC-CMB-001','2025-10-17',  22300.00,'TRAIN');

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
('ORD-0070','PRD-DET-1KG',13,7,850.00), ('ORD-0070','PRD-OFK-5L',4,4,2200.00),

-- Order items for TRAIN status orders
('ORD-0071','PRD-RIC-10',12,15,1500.00),('ORD-0071','PRD-TEA-200',16,5,700.00),
('ORD-0072','PRD-DET-1KG',14,7,850.00), ('ORD-0072','PRD-SOAP-100',60,6,180.00),
('ORD-0073','PRD-OFK-5L',5,5,2200.00),  ('ORD-0073','PRD-RIC-10',8,10,1500.00);

-- =========================
-- Users & Roles
-- Sample users with passwords (password: 'emp123' for all)
INSERT INTO users (user_id, store_id, name, password, designation, is_employed) VALUES
('USR-ADM-01',NULL,'System Admin','emp123','Admin',1),
('USR-MGR-MAIN',NULL,'Anura Perera','emp123','Main Store Manager',1),
('USR-MGR-CMB','ST-CMB-01','Rashmi De Silva','emp123','Store Manager',1),
('USR-DRV-01','ST-CMB-01','Kumara Jayasuriya','emp123','Driver',1),
('USR-DRV-02','ST-CMB-01','Sujeewa Fernando','emp123','Driver',1),
('USR-DRV-03','ST-CMB-01','Isuru Weerasekara','emp123','Driver',1),
('USR-ASS-01','ST-CMB-01','Nadeesha Karu','emp123','Assistant',1),
('USR-ASS-02','ST-CMB-01','Ruwan Perera','emp123','Assistant',1);

INSERT INTO store_managers (manager_id) VALUES
('USR-MGR-MAIN'),
('USR-MGR-CMB');

INSERT INTO delivery_employees (user_id, working_hours, availability) VALUES
('USR-DRV-01',25.50,1),
('USR-DRV-02',18.75,1),
('USR-DRV-03',32.25,1),
('USR-ASS-01',16.00,1),
('USR-ASS-02',23.50,1);

INSERT INTO admins (admin_id, username, email, password) VALUES
('ADM-ROOT','root','root@kandypack.lk','$2y$dummyhash');


SET FOREIGN_KEY_CHECKS = 1;
