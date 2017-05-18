
const mods = require('../../../data.json');

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
      let peoplePromise = [];

      mods.results.forEach((mod) => {
        peoplePromise.push(createPeople(knex, mod));
      })
      return Promise.all(peoplePromise);
    })
    .catch((error) => {
      console.log('error', error);
    })
  }

  function createPeople(knex, mod) {
    console.log(mod);
    return knex('people')
      .insert({
        genders: mod.gender,
        races: mod.race,
        ages: mod.age,
        mods_id: mod.mod,
      })
  }
