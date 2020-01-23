exports.up = function (knex) {
    return knex.schema.createTable('job_vacancies', table => {
        table.increments('id').primary()

        table.timestamp('created_at').notNull()

        table.integer('admin_id').unsigned().notNull().references('id').inTable('administrators').onDelete('CASCADE').onUpdate('CASCADE')

        table.string('title').notNull()
        table.text('description').notNull()

    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('job_vacancies')
};