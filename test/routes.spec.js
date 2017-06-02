process.env.NODE_ENV = 'test';

const chai = require('chai');

const chaiHttp = require('chai-http');

const server = require('../server');

const should = chai.should();

const configuration = require('../knexfile')['test'];

const database = require('knex')(configuration);


chai.use(chaiHttp);

describe('Diversity Tracker server testing', () => {
  before((done) => {
    database.migrate.latest()
    .then(() => {
      return database.seed.run();
    })
    .then(() => {
      done();
    });
  });

  beforeEach((done) => {
    database.seed.run()
    .then(() => {
      done();
    });
  });

  describe('API routes', () => {
    describe('GET /api/v1/mods', () => {
      it('should return all mods', (done) => {
        chai.request(server)
        .get('/api/v1/mods')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.should.have.length(4);
          response.body[0].should.have.property('name');
          done();
        });
      });
    });

    describe('API routes', () => {
      describe('GET /api/v1/mods', () => {
        it('should return all mod1 people', (done) => {
          chai.request(server)
          .get('/api/v1/mods/1/people')
          .end((error, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.should.have.length(4);
            response.body[0].should.have.property('name');
            done();
          });
        });
      });
    });//maybe not

    describe('GET /api/v1/people', () => {
      it('should return all people', (done) => {
        chai.request(server)
        .get('/api/v1/people')
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.have.length(30);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body[0].should.have.property('genders');
          response.body[0].should.have.property('races');
          response.body[0].should.have.property('ages');
          done();
        });
      });
    });
  });//figire out brackets

    describe('GET /api/v1/mods/:mods_id', () => {
      it('should return one mods with an id', (done) => {
        chai.request(server)
        .get('/api/v1/mods/1')
        .end((error, response) => {
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.should.have.length(1);
          response.body[0].should.have.property('name');
          done();
        });
      });
    });

    describe('GET /api/v1/people/:id', () => {
      it('should return one person with an id', (done) => {
        chai.request(server)
        .get('/api/v1/people')
        .end((error, response) => {
          console.log(response.body);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.should.have.length(1);
          response.body[0].should.have.property('genders');
          response.body[0].should.have.property('races');
          response.body[0].should.have.property('ages');
          done();
        });
      });
    });

    describe('POST /api/v1/mods', () => {
      it('should not add an mod if name not passed in', (done) => {
        chai.request(server)
        .post('/api/v1/mods')
        .set('Authorization', process.env.TOKEN)
        .send({ })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          done();
        });
      });
    });

    describe('Sad Route', () => {
      it('should return a 404 for a sad route', (done) => {
        chai.request(server)
        .get('/api/v1/mods/sad')
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
      });

      it('should return status 404 when no mods match', (done) => {
        chai.request(server)
        .get('/api/v1/mods/593k')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
      });

      it('should return status 404 when no people match', (done) => {
        chai.request(server)
        .get('/api/v1/people/964k')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
      });
    });

    describe('PATCH /api/v1/mods/:id/edit', () => {
      it('should be able to PATCH a specific mod', (done) => {
        chai.request(server)
        .get('/api/v1/mods/1')
        .end((error, response) => {
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('mod1');
          response.body[0].id.should.equal(1);
          chai.request(server)
          .patch('api/v1/mods/1/edit')
          .set('Authorization', process.env.TOKEN)
          .send({
            name: 'hi',
          })
          .end((error, response) => {
            response.should.have.status(200);
            response.body.name.should.equal('hi');
            response.body.id.should.equal(1);
          });
          done();
        });
      });
    });

    describe('PUT /api/v1/people/:id/override', () => {
      it.skip('should be able to PUT a specific mod', (done) => {
        chai.request(server)
        .get('/api/v1/people/122')
        .end((error, response) => {
          response.body[0].gender.should.equal('Female');
          chai.request(server)
          .put('api/v1/people/122/override')
          .set('Authorization', process.env.TOKEN)
          .send({
            gender: 'Other',
            race: 'Other',
          })
          .end((error, response) => {
            response.should.have.status(200);
            response.body.gender.should.equal('Other');
            response.body.race.should.equal('Other');
            response.body.id.should.equal(122);
          });
          done();
        });
      });
    });

    describe('DELETE /api/v1/mods/:id', () => {
      it.skip('should be able to delete a mod', (done) => {
        chai.request(server)
        .get('/api/v1/mods')
        .end((error, response) => {
          response.body.length.should.equal(4);
          chai.request(server)
          .delete('api/v1/mods/2')
          .set('Authorization', process.env.TOKEN)
          .end((error, response) => {
            response.should.have.status(204);
            chai.request(server)
            .get('/api/v1/mods')
            .end((error, response) => {
              response.body.length.should.equal(3);
            });
            done();
          });
        });
      });
    });


  });
});
