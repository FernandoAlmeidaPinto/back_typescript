import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PrepSchool from "App/Models/PrepSchool"
import PrepSchoolValidator from 'App/Validators/PrepSchoolValidator'

export default class PrepSchoolsController {
  public async AddPrepSchool({ auth, request, response }: HttpContextContract) {
    if(!auth.user?.admin){
      return response.status(401).json({ error: "Você não tem Autorização"})
    }
    const newPrepSchool = await request.validate(PrepSchoolValidator)

    const prepSchool = new PrepSchool()
    prepSchool.name = newPrepSchool.name
    prepSchool.cep = newPrepSchool.cep
    prepSchool.state = newPrepSchool.state
    prepSchool.city = newPrepSchool.city
    prepSchool.district = newPrepSchool.district
    prepSchool.street = newPrepSchool.street
    prepSchool.number = newPrepSchool.number
    prepSchool.complement = newPrepSchool.complement
    prepSchool.phone = newPrepSchool.phone
    prepSchool.whatsapp = newPrepSchool.whatsapp
    prepSchool.email = newPrepSchool.email
    prepSchool.email2 = newPrepSchool.email2
    prepSchool.category = newPrepSchool.category
    prepSchool.site = newPrepSchool.site
    prepSchool.linkedin = newPrepSchool.linkedin
    prepSchool.youtube = newPrepSchool.youtube
    prepSchool.facebook = newPrepSchool.facebook
    prepSchool.instagram = newPrepSchool.instagram
    prepSchool.twitter = newPrepSchool.twitter
    prepSchool.tiktok = newPrepSchool.tiktok
    prepSchool.geolocation_id = newPrepSchool.geolocation_id

    await prepSchool.save()

    return prepSchool
  }

  public async ListPrepSchools({ params, request, response }: HttpContextContract) {
    if(params.id) {
      const prepSchools = await PrepSchool.find(params.id)
      return response.status(200).json(prepSchools)
    }

    if(request.input("geoId")) {
      const {geoId} = request.get();
      const prepSchools = await PrepSchool.query().where("geolocation_id", geoId)
      return response.status(200).json(prepSchools)
    }

    const allPrepSchool = await PrepSchool.all()
    return response.status(200).json(allPrepSchool)
  }

  public async DelPrepSchool({ auth, params, response }: HttpContextContract) {
    if(!auth.user?.admin){
      return response.status(401).json({ error: "Você não tem Autorização"})
    }
    const idPrepSchool = params.id

    const prepSchool = await PrepSchool.findByOrFail('id', idPrepSchool)

    await prepSchool.delete()
  }
}
