
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('people'),
    knex.schema.dropTable('genders'),
    knex.schema.dropTable('races'),
    knex.schema.dropTable('ages'),

    knex.schema.createTable('allPeople', function (table) {
      table.increments('id').primary();
      table.string('name');

      table.timestamps();
    }),
    knex.schema.createTable('peopleInfo', function (table) {
      table.increments('id').primary();
      table.string('genders');
      table.string('races');
      table.string('ages');
      table.integer('allPeople_id').unsigned();
      table.foreign('allPeople_id')
        .references('allPeople.id');

      table.timestamps();
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('genders', function (table) {
      table.increments('id').primary();
      table.string('gender');

      table.timestamps();
    }),

    knex.schema.createTable('races', function (table) {
      table.increments('id').primary();
      table.string('race');

      table.timestamps();
    }),

    knex.schema.createTable('ages', function (table) {
      table.increments('id').primary();
      table.string('age');

      table.timestamps();
    }),

    knex.schema.createTable('people', function (table) {
      table.increments('id').primary();
      table.integer('gender_id').unsigned();
      table.foreign('gender_id')
        .references('genders.id');
      table.integer('race_id').unsigned();
      table.foreign('race_id')
        .references('races.id');
      table.integer('age_id').unsigned();
      table.foreign('age_id')
        .references('ages.id');

      table.timestamps();
    }),
    knex.schema.dropTable('peopleInfo'),
    knex.schema.dropTable('allPeople'),
  ]);
};
