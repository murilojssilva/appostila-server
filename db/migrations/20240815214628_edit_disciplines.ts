import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('disciplines', (table) => {
    table.text('icon').nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('disciplines', (table) => {
    table.dropColumn('icon')
  })
}
