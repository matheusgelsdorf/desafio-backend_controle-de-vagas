exports.up = function(knex) {
    return knex.schema.createTable('candidates',table =>{
        table.increments('id').primary()
        
        table.timestamp('registered_at').notNull()
        table.timestamp('deleted_at')

        table.string('name').notNull()
        table.string('email').notNull().unique()
        table.string('cpf',11).notNull().unique()
        table.string('phone',30).notNull().unique()
        table.string('password').notNull()
    })
  };
  
  exports.down = function(knex) {
      return knex.schema.dropTable('candidates')
  };

