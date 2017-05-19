module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/diversity',
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds/dev',
    },
    useNullAsDefault: true,
  },

  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/diversity_test',
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds/test',
    },
    useNullAsDefault: true,
  },
};
