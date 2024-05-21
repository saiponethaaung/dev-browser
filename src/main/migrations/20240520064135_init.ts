import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists('session', function (table) {
    table.bigIncrements('id', { primaryKey: true });
    table.string('name');
    table.string('host');
    table.string('username').nullable();
    table.string('password').nullable();
    table.boolean('auto_signin').defaultTo(true);
    table.dateTime('created_at').defaultTo(new Date());
    table.dateTime('updated_at').defaultTo(new Date());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('session');
}
