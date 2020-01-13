module.exports = {
  client: 'postgresql',
  connection: {
    database: 'tcc_db',
    user:     'postgres',
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
