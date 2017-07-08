# BYOB/Diversity Tracker

##[Heroku](https://diversity-tracker.herokuapp.com/)

## Endpoints

- **[<code>GET</code> mods](https://diversity-tracker.herokuapp.com/api/v1/mods)**
- **[<code>GET</code> people](https://diversity-tracker.herokuapp.com/api/v1/people)**
- **[<code>GET</code> mods/:mods_id/people](https://diversity-tracker.herokuapp.com/api/v1/mods/1/people)**
- **[<code>GET</code> people/:id](https://diversity-tracker.herokuapp.com/api/v1/people/:20)**

* All POST/PUT/DELETE/PATCH endpoints are protected by JWT's

- **[<code>POST</code> mods](https://diversity-tracker.herokuapp.com/api/v1/mods)**
- Allows the user to add a new module category by passing though `name` in the request body.
- **[<code>POST</code> people](https://diversity-tracker.herokuapp.com/api/v1/mods/:mods_id/people)**
- Allows the user to add a new peson to a specific mod by passing though `gender`, `age`, `race` and `mod_id` in the request body.
- **[<code>DELETE</code> mods/:id](https://diversity-tracker.herokuapp.com/api/v1/mods/:id)**
- Allows the user to delete an existing module category by passing though the module ID in the request body.
- **[<code>DELETE</code> people/:id](https://diversity-tracker.herokuapp.com/api/v1/people/:id)**
- Allows the user to delete an existing person by passing though the persons ID in the request body.
- **[<code>PATCH</code> mods/:id/edit](https://diversity-tracker.herokuapp.com/api/v1/mods/:id/edit)**
- Allows the user to update an existing module name by passing `name` in the request body.
