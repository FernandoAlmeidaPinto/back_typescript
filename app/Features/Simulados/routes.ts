import Route from '@ioc:Adonis/Core/Route'

Route.post('/newtypesimulate', 'SimuladosController.CriarTipo').middleware('auth')
Route.delete('/deltypesimulate/:id', 'SimuladosController.DeletarTipo').middleware('auth')
Route.get('/listtypesimulate', 'SimuladosController.ListarTipos').middleware('auth')

Route.post('/newsimulate', 'SimuladosController.CriarSimulado').middleware('auth')
Route.get('/callsimulate/:id', 'SimuladosController.ChamarSimulado').middleware('auth')
Route.post('/answersimulate', 'SimuladosController.RespostaSimulado').middleware('auth')