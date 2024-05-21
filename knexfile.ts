import type { Knex } from 'knex';

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/main/mydb.sqlite',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/main/migrations',
    },
  },

  staging: {
    client: 'sqlite3',
    connection: {
      filename: './src/main/mydb.sqlite',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/main/migrations',
    },
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: './src/main/mydb.sqlite',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/main/migrations',
    },
  },
};

module.exports = config;
