import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GeolocationValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    name: schema.string(),
    latitude: schema.number(),
    longitude: schema.number(),
    address: schema.string(),
  })

  public messages = {}
}
