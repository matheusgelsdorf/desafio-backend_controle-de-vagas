// Update with your config settings.

module.exports = {

  client: 'postgresql',
  connection: {
    database: 'desafio_db',
    user: 'postgres',
    password: 'abc123'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }


};
