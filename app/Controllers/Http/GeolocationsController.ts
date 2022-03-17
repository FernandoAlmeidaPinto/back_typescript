import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Geolocation from "App/Models/Geolocation"
import GeolocationValidator from 'App/Validators/GeolocationValidator'

export default class GeolocationsController {
  public async AddGeolocation({ auth, request, response }: HttpContextContract) {
    if(!auth.user?.admin){
      return response.status(401).json({ error: "Você não tem Autorização"})
    }
    const newGeolocation = await request.validate(GeolocationValidator)

    const geolocation = new Geolocation()
    geolocation.name = newGeolocation.name
    geolocation.latitude = newGeolocation.latitude
    geolocation.longitude = newGeolocation.longitude
    geolocation.address = newGeolocation.address

    await geolocation.save()

    return geolocation
  }

  public async ListGeolocations({ response }: HttpContextContract) {
    const allGeolocation = await Geolocation.all()

    return response.status(200).json(allGeolocation)
  }

  public async DelGeolocation({ auth, params, response }: HttpContextContract) {
    if(!auth.user?.admin){
      return response.status(401).json({ error: "Você não tem Autorização"})
    }
    const idGeolocation = params.id

    const geolocation = await Geolocation.findByOrFail('id', idGeolocation)

    await geolocation.delete()
  }
}
