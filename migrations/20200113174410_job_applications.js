exports.up = function (knex) {
    return knex.schema.createTable('job_applications', table => {
        table.increments('id').primary()
        table.timestamp('applied_at').notNull()
        table.timestamp('deleted_at')
        table.integer('vacancy_id').unsigned().notNull().references('id').inTable('job_vacancies')
        table.integer('candidate_id').unsigned().notNull().references('id').inTable('candidates')

        table.integer('current_stage').unsigned().notNull()
        table.integer('stages').unsigned().notNull()

    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('job_applications')
};