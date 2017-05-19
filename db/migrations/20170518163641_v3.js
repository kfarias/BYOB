
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('peopleInfo'),
    knex.schema.dropTable('allPeople'),

    knex.schema.createTable('mods', function (table) {
      table.increments('id').primary();
      table.string('name');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('people', function (table) {
      table.increments('id').primary();
      table.string('genders');
      table.string('races');
      table.string('ages');
      table.integer('mods_id').unsigned();
      table.foreign('mods_id')
        .references('mods.id');
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
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
    knex.schema.createTable('allPeople', function (table) {
      table.increments('id').primary();
      table.string('name');

      table.timestamps();
    }),
    knex.shema.dropTable('mods'),
    knex.shema.dropTable('people')
  ]);
};
