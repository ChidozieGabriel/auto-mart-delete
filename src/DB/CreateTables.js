import DB from '.';

const dropTableUsers = 'DROP TABLE IF EXISTS users CASCADE';
const createTableUsers = `
CREATE TABLE IF NOT EXISTS users (
  id uuid NOT NULL,
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
CREATE TABLE IF NOT EXISTS cars
(
    id uuid NOT NULL,
    user_id uuid NOT NULL,
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
        REFERENCES users (id) MATCH SIMPLE
);
`;

class CreateTables {
  static async create() {
    await DB.query(dropTableUsers);
    await DB.query(createTableUsers);
    await DB.query(dropTableCars);
    await DB.query(createTableCars);
  }
}

CreateTables.create().catch(err => console.log(err));
