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

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', 'PostsController.index' ).as('home')

Route.get('/create', 'PostsController.create' )
Route.post('/create', 'PostsController.store' )

Route.get('/post/:id', 'PostsController.show')
Route.get('/post/:id/edit', 'PostsController.edit')
Route.patch('/post/:id', 'PostsController.update')

Route.delete('/post/:id', 'PostsController.destroy')
