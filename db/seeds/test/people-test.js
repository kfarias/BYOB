
const mods = require('../../../data.json');

function createPeople(knex, mod) {
  return knex('people')
    .insert({
      genders: mod.gender,
      races: mod.race,
      ages: mod.age,
      mods_id: mod.mod,
    });
}

exports.seed = function (knex, Promise) {
  return knex('people').del()
    .then(() => knex('mods').del())
    .then(() => {
      return Promise.all([
        knex.table('mods')
        .insert([
          {
            name: 'mod1',
            id: 1
          },
          {
            name: 'mod2',
            id: 2
          },
          {
            name: 'mod3',
            id: 3
          },
          {
            name: 'mod4',
            id: 4
          }
        ])
      ]);
    })
    .then(() => {
      const peoplePromise = [];

      mods.results.forEach((mod) => {
        peoplePromise.push(createPeople(knex, mod));
      });
      return Promise.all(peoplePromise);
    })
    .catch((error) => {
      console.log('error', error);
    });
};
