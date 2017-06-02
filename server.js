const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('dotenv').config().parsed;
const app = express();


const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.locals.title = 'Diversity Tracker';

app.set('secretKey', process.env.CLIENT_SECRET || config.CLIENT_SECRET);
const token = jwt.sign('user', app.get('secretKey'));
app.set('port', process.env.PORT || 3000);

const checkAuth = (request, response, next) => {
  const token = request.body.token ||
  request.params.token ||
  request.headers.authorization;
  if (token) {
    jwt.verify(token, app.get('secretKey'), (error, decoded) => {
      if (error) {
        return response.status(403).send({
          success: false,
          message: 'You are not Authorized to Change things!',
        });
      } else {
        request.decoded = decoded;
        next();
      }
    });
  } else {
    return response.status(403).send({
      success: false,
      message: 'Hey, we got your token, but it doesnt work.',
    });
  }
};

// GET
app.get('/api/v1/mods', (request, response) => {
  database('mods').select()
  .then(mods => response.status(200).json(mods))
  .catch(() => {
    response.status(500).send('no mods found');
  });
});

app.get('/api/v1/people', (request, response) => {
  database('people').select()
  .then(people => response.status(200).json(people))
  .catch(error => console.error('error: ', error));
});

app.get('/api/v1/mods/:mods_id/people', (request, response) => {
  database('people').where('mods_id', request.params.mods_id).select()
    .then((people) => {
      response.status(200).json(people);
    })
    .catch(() => {
      response.status(404).send('no people found for this mod');
    });
});

app.get('/api/v1/people/:id', (request, response) => {
  database('people').where('id', request.params.id).select()
  .then((people) => {
    response.status(200).json(people);
  })
  .catch((error) => {
    response.status(404).send('resource not found')
  });
});

app.get('/api/v1/mods/:id', (request, response) => {
  database('mods').where('id', request.params.id).select()
  .then((mods) => {
    response.status(200).json(mods);
  })
  .catch((error) => {
    response.status(404).send('resource not found')
  });
});

// POST
app.post('/api/v1/mods', checkAuth, (request, response) => {
  const mod = request.body;
  const name = request.body.name;

  if (!name) {
    response.status(422).send({
      error: 'You are missing a mod name!',
    });
  } else {
    database('mods').insert(mod, 'id')
    .then((modObj) => {
      response.status(201).json({
        id: modObj[0],
        name,
      });
    })
    .catch((error) => {
      console.error('error: ', error);
    });
  }
});

app.post('/api/v1/mods/:mods_id/people', checkAuth, (request, response) => {
  const peopleObj = {
    genders: request.body.genders,
    races: request.body.races,
    ages: request.body.ages,
    mods_id: request.params.mods_id,
  };
  if (!peopleObj.ages) {
    response.status(422).send({
      error: 'Please enter an age so we can be more accurate!',
    });
  } else if (!peopleObj.genders) {
    response.status(422).send({
      error: 'Please enter and answer for the gender section so we can be more accurate!',
    });
  } else {
    database('people').insert(peopleObj)
    .then(() => {
      database('people').where('mods_id', request.params.mods_id).select()
        .then((people) => {
          response.status(201).json(people);
        })
        .catch((error) => {
          console.error('error: ', error);
        });
    });
  }
});


// PATCH
app.patch('/api/v1/mods/:id/edit', checkAuth, (request, response) => {
  const { mods, id } = request.body;
  database('mods').where('id', request.params.id)
  .update({
    name: request.body.name,
  })
    .then(() => {
      database('mods').select()
      .then((mods) => {
        response.status(200).json(mods);
      });
    })
    .catch(error => console.log(error));
});

// PUT
app.put('/api/v1/people/:id/override', checkAuth, (request, response) => {
  database('people').where('id', request.params.id)
  .update({
    id: request.body.people.id,
    genders: request.body.genders,
    races: request.body.races,
    ages: request.body.ages,
    mods_id: request.body.mods_id,
  })
  .then(() => {
    database('people').select()
    .then((people) => {
      response.status(200).json(people);
    });
  });
});

// DELETE
app.delete('/api/v1/mods/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  database('mods').where('id', id).del()
  .then(() => {
    database('mods').select()
    .then((mods) => {
      response.status(204).json(mods);
    })
    .catch((error) => {
      response.status(404).send('resource not found')
    });
  });
});

app.delete('/api/v1/people/:id', checkAuth, (request, response) => {
  const { id } = request.params;

  database('people').where('mods_id', id).update({ mods_id: null })
  .then(() => {
    database('people').where('id', id).del()
    .then(() => {
      database('people').select()
      .then((people) => {
        response.status(200).json(people);
      })
      .catch((error) => {
        response.status(404).send('resource not found')
      });
    });
  });
});


app.listen(app.get('port'), () => {
  console.log(`port is running on ${app.get('port')}.`);
});


module.exports = app;
