import Route from '@ioc:Adonis/Core/Route'

//#region Exame
Route.post('/novoexame', 'ExamsController.NovoExame').middleware('auth')
Route.delete('/delexam/:id', 'ExamsController.DelExam').middleware('auth')
Route.get('/listarexams', 'ExamsController.ListarExams').middleware('auth')
//#endregion

//#region Area do Enem
Route.post('/novaarea', 'EnemsController.CreateEnemArea').middleware('auth')
//Route.get('/listarexams', 'EnemsController.ListarExams').middleware('auth')
Route.patch('/atualizaarea', 'EnemsController.UpdateEnemArea').middleware('auth')
Route.delete('/delarea/:id', 'EnemsController.DeleteEnemArea').middleware('auth')
//#endregion

//#region Materia
Route.post('/novamateria', 'EnemsController.CreateMateria').middleware('auth')
Route.patch('/atualizamateria', 'EnemsController.UpdateMateria').middleware('auth')
Route.delete('/delmateria/:id', 'EnemsController.DeleteMateria').middleware('auth')
//#endregion

//#region Frente
Route.post('/novafrente', 'EnemsController.CreateFrente').middleware('auth')
Route.delete('/delfrente/:id', 'EnemsController.DeleteFrente').middleware('auth')
Route.patch('/atualizafrente', 'EnemsController.UpdateFrente').middleware('auth')
//#endregion

//#region Questao
Route.post('/novaquestao', 'QuestionsController.NovaQuestao').middleware('auth')
Route.delete('/deletarquestao/:id', 'QuestionsController.DeletarQuestao').middleware('auth')
Route.get('/selecionarquestao/:id', 'QuestionsController.SelecionarQuestao').middleware('auth')
Route.get('/listallquestion', 'QuestionsController.ListarQuestoes')
//#endregion

Route.post('/xlsx', 'QuestionsController.XlsxUploadQuestion').middleware('auth')

Route.get('/allenem', 'EnemsController.AllEnem').middleware('auth')