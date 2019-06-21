import DB from '.';

const dropTableUsers = 'DROP TABLE IF EXISTS users CASCADE';
const createTableUsers = `
CREATE TABLE users
(
    _id bigserial NOT NULL,
    id character varying(100) NOT NULL,
    created_on timestamp with time zone NOT NULL,
    email character varying(50) NOT NULL,
    firstname character varying(20),
    lastname character varying(20),
    address character varying(100),
    password character varying(512) NOT NULL,
    is_admin boolean,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);
`;

const dropTableCars = 'DROP TABLE IF EXISTS cars CASCADE';
const createTableCars = `
CREATE TABLE cars
(
    _id bigserial NOT NULL,
    id character varying(100) NOT NULL,
    user_id character varying(100) NOT NULL,
    created_on timestamp with time zone NOT NULL,
    state character varying(20),
    status character varying(20),
    price numeric NOT NULL,
    manufacturer character varying(20) NOT NULL,
    model character varying(20),
    body_type character varying(20),
    image_url character varying(256),
    CONSTRAINT cars_pkey PRIMARY KEY (id),
    CONSTRAINT cars_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES users (id)
);
`;

const dropTableOrders = 'DROP TABLE IF EXISTS orders CASCADE';
const createTableOrders = `
CREATE TABLE orders
(
    _id bigserial NOT NULL,
    id character varying(100) NOT NULL,
    user_id character varying(100) NOT NULL,
    car_id character varying(100) NOT NULL,
    created_on timestamp with time zone NOT NULL,
    price_offered numeric NOT NULL,
    status character varying(20) DEFAULT 'pending',
    CONSTRAINT orders_pkey PRIMARY KEY (id),
    CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES users (id),
    CONSTRAINT orders_car_id_fkey FOREIGN KEY (car_id)
        REFERENCES cars (id)
);
`;

class CreateTables {
  static async create() {
    await DB.query(dropTableUsers);
    await DB.query(dropTableCars);
    await DB.query(dropTableOrders);

    await DB.query(createTableUsers);
    await DB.query(createTableCars);
    await DB.query(createTableOrders);
  }
}

CreateTables.create().catch(err => console.log(err));
