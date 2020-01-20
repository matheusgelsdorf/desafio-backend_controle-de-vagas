exports.up = function (knex) {
    return knex.schema.createTable('comments', table => {
        table.increments('id').primary()
        
        table.timestamp('posted_at').notNull()
        table.timestamp('edited_at')
        table.timestamp('deleted_at')
        
        table.integer('admin_id').unsigned().notNull().references('id').inTable('administrators').onDelete('CASCADE').onUpdate('CASCADE')
        table.integer('application_id').unsigned().notNull().references('id').inTable('job_applications').onDelete('CASCADE').onUpdate('CASCADE')

        table.text('content').notNull()
      

    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('comments')
};