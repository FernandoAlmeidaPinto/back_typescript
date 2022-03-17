import Route from '@ioc:Adonis/Core/Route'

Route.post('/geolocations', 'GeolocationsController.AddGeolocation').middleware('auth')
Route.get('/geolocations', 'GeolocationsController.ListGeolocations')
Route.delete('/geolocations/:id', 'GeolocationsController.DelGeolocation').middleware('auth')
