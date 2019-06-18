import DB from '.';

const dropTableUsers = 'DROP TABLE IF EXISTS users';

DB.query(dropTableUsers).catch(err => console.log(err));
