/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.get("/", "PostsController.index").as("home");
Route.get("/post/:id", "PostsController.show").as("post.show");

// routes for auth
Route.get("/login", "AuthController.index").as("login");
Route.post("/login", "AuthController.login").as("doLogin");
Route.get("/register", "AuthController.register").as("register");
Route.post("/register", "AuthController.create").as("doRegister");
Route.post('/logout', 'AuthController.logout').as('logout')

// route for authenticated user
Route.group(() => {
  Route.get("/create", "PostsController.create").as("post.create");
  Route.post("/create", "PostsController.store");

  Route.get("/post/:id/edit", "PostsController.edit").as("post.edit");
  Route.patch("/post/:id", "PostsController.update").as("post.update");

  Route.delete("/post/:id", "PostsController.destroy").as("post.delete");
}).middleware('auth');
