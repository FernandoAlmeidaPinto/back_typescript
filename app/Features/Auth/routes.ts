import Route from '@ioc:Adonis/Core/Route'

Route.post('/cadastro', 'AuthController.register')
Route.post('/login', 'AuthController.login')
Route.get('/logout', 'AuthController.logout').middleware('auth')
Route.get('/me', 'AuthController.me').middleware('auth')
Route.put('/patchme', 'AuthController.patchme').middleware('auth')
Route.patch('/patchadmin', 'AuthController.patchAdmin').middleware('auth')
Route.get('/deleteuser/:id', 'AuthController.delete').middleware('auth')

Route.post('/esqueci-minha-senha', 'ForgotsController.forgot')
Route.patch('/reset', 'ForgotsController.reset')