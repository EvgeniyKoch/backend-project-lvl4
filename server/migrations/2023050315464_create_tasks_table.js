/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const up = (knex) => (
    knex.schema.createTable('tasks', (table) => {
        table.increments('id').primary();
        table.string('name');
        table.string('description');
        table.string('status_id');
        table.string('creator_id');
        table.string('executor_id');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
);

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => knex.schema.dropTable('tasks');
