import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists('record_log', function (table) {
    table.bigIncrements('id', { primaryKey: true });
    table.bigInteger('record_id').nullable();
    table.jsonb('data');
    table.string('ref');
    table.string('type').defaultTo('xhr');
    table.dateTime('timestamp').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table.dateTime('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table.dateTime('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));

    table.foreign('record_id').references('id').inTable('session');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('record_log');
}
