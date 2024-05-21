import path from 'path';

export const knex = require('knex')({
  client: 'sqlite',
  connection: {
    filename: path.join(__dirname, 'mydb.sqlite'),
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.join(__dirname, 'migrations'),
  },
  useNullAsDefault: true,
});

export const initDB = () => {
  console.log('run migration');
  knex.migrate.latest();
};
