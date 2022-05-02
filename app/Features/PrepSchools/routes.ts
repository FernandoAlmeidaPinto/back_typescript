import Route from '@ioc:Adonis/Core/Route'

Route.post('/prepSchools', 'PrepSchoolsController.AddPrepSchool').middleware('auth')
Route.get('/prepSchools', 'PrepSchoolsController.ListPrepSchools')
Route.delete('/prepSchools/:id', 'PrepSchoolsController.DelPrepSchool').middleware('auth')
