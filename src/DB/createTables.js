import DB from '.';

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

DB.query(createTableUsers).catch(err => console.log(err));
