import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists('record', function (table) {
    table.bigIncrements('id', { primaryKey: true });
    table.string('ref').unique();
    table.bigInteger('session_id').nullable();
    table.dateTime('start_timestamp').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table.dateTime('end_timestamp').nullable();
    table.dateTime('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table.dateTime('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));

    table.foreign('session_id').references('id').inTable('session');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('record');
}
