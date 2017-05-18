const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Diversity Tracker';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET
app.get('/api/v1/mods', (request, response) => {
  database('mods').select()
  .then(mods => response.status(200).json(mods))
  .catch(error => console.error('error: ', error));
});

// app.get('/api/v1/query', (request, response) => {
//   database('query').select()
//   .then(query => response.status(200).json(query))
//   .catch(error => console.error('error: ', error));
// });
//
// app.get('/api/v1/quizzes/:quiz_id/query', (request, response) => {
//   database('query').where('quiz_id', request.params.quiz_id).select()
//     .then((query) => {
//       response.status(200).json(query);
//     })
//     .catch((error) => {
//       console.error('error: ', error);
//     });
// });
//
// app.get('/api/v1/query/:id', (request, response) => {
//   database('query').where('id', request.params.id).select()
//   .then((query) => {
//     response.status(200).json(query);
//   })
//   .catch((error) => {
//     console.error('error: ', error);
//   });
// });

// // POST
// app.post('/api/v1/quizzes', (request, response) => {
//   const quiz = request.body;
//   const title = request.body.title;
//
//   if (!title) {
//     response.status(422).send({
//       error: 'You are missing a title!',
//     });
//   } else {
//     database('quizzes').insert(quiz, 'id')
//     .then((quizObj) => {
//       response.status(201).json({
//         id: quizObj[0],
//         title,
//       });
//     })
//     .catch((error) => {
//       console.error('error: ', error);
//     });
//   }
// });
//
// app.post('/api/v1/quizzes/:quiz_id/query', (request, response) => {
//   const queryObj = {
//     question: request.body.question,
//     answer: request.body.answer,
//     quiz_id: request.params.quiz_id,
//   };
//   if (!queryObj.question) {
//     response.status(422).send({
//       error: 'How can we ask a question without a question? (Direct quote from Socrates)',
//     });
//   } else if (!queryObj.answer) {
//     response.status(422).send({
//       error: 'Not much of a quiz without an answer - please resubmit.',
//     });
//   } else {
//     database('query').insert(queryObj)
//     .then(() => {
//       database('query').where('quiz_id', request.params.quiz_id).select()
//         .then((question) => {
//           response.status(201).json(question);
//         })
//         .catch((error) => {
//           console.error('error: ', error);
//         });
//     });
//   }
// });
//
// if (!module.parent) {
//   app.listen(app.get('port'), () => {
//   });
// }

module.exports = app;
