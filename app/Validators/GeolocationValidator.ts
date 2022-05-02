import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GeolocationValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    latitude: schema.number(),
    longitude: schema.number(),
  })

  public messages = {}
}
