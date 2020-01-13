exports.up = function (knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary()
        table.timestamp('registered_at').notNull()
        table.timestamp('deleted_at')
        table.integer('operatorId').notNull().references('id').inTable('operators')

        table.string('name').notNull()
        table.string('email').notNull().unique()
        table.string('cpf',11).unique().notNull()
        table.string('rg',20).unique().notNull()
        table.string('registrationNumber').unique().notNull()
        table.string('course')
        table.enum('userType', ['Servidor', 'Aluno']).notNull()
        table.string('password').notNull()
        table.string('hardwarePassword').notNull()

    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('users')
};
