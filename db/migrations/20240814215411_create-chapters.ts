import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('chapters', (table) => {
    table.uuid('id').primary()
    table.integer('number').notNullable()
    table.text('title').notNullable()

    table.uuid('discipline_id').notNullable()
    table
      .foreign('discipline_id')
      .references('id')
      .inTable('disciplines')
      .onDelete('CASCADE')

    table.unique(['number', 'discipline_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('chapters')
}
