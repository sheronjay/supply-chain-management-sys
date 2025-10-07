SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET time_zone = '+00:00';

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
  used_hours      DECIMAL(4,2),
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

SET FOREIGN_KEY_CHECKS = 1;
