import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('disciplines', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('displayName').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('disciplines')
}
