import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Geolocation from 'App/Models/Geolocation'
import GeolocationValidator from 'App/Validators/GeolocationValidator'

export default class GeolocationsController {
  public async AddGeolocation({ auth, request, response }: HttpContextContract) {
    if (!auth.user?.admin) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }
    const newGeolocation = await request.validate(GeolocationValidator)

    const geolocation = new Geolocation()
    geolocation.latitude = newGeolocation.latitude
    geolocation.longitude = newGeolocation.longitude
    geolocation.name = newGeolocation.name
    geolocation.cep = newGeolocation.cep
    geolocation.state = newGeolocation.state
    geolocation.city = newGeolocation.city
    geolocation.neighborhood = newGeolocation.neighborhood
    geolocation.street = newGeolocation.street
    geolocation.number = newGeolocation.number
    geolocation.complement = newGeolocation.complement ?? ''
    geolocation.phone = newGeolocation.phone ?? ''
    geolocation.whatsapp = newGeolocation.whatsapp ?? ''
    geolocation.email = newGeolocation.email ?? ''
    geolocation.email2 = newGeolocation.email2 ?? ''
    geolocation.category = newGeolocation.category ?? ''
    geolocation.site = newGeolocation.site ?? ''
    geolocation.linkedin = newGeolocation.linkedin ?? ''
    geolocation.youtube = newGeolocation.youtube ?? ''
    geolocation.facebook = newGeolocation.facebook ?? ''
    geolocation.instagram = newGeolocation.instagram ?? ''
    geolocation.twitter = newGeolocation.twitter ?? ''
    geolocation.tiktok = newGeolocation.tiktok ?? ''

    await geolocation.save()

    return geolocation
  }

  public async ListGeolocations({ params, request, response }: HttpContextContract) {
    if (params.id) {
      const geolocation = await Geolocation.find(params.id)
      return response.status(200).json(geolocation)
    }

    if (request.input('latitude') && request.input('longitude')) {
      const { latitude, longitude } = request.get()
      const geolocation = await Geolocation.query()
        .where('latitude', latitude)
        .andWhere('longitude', longitude)

      return response.status(200).json(geolocation)
    }

    const allGeolocation = await Geolocation.all()
    return response.status(200).json(allGeolocation)
  }

  public async DelGeolocation({ auth, params, response }: HttpContextContract) {
    if (!auth.user?.admin) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }
    const idGeolocation = params.id

    const geolocation = await Geolocation.findByOrFail('id', idGeolocation)

    await geolocation.delete()
  }
}
