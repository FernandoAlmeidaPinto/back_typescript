import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GeolocationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    latitude: schema.number(),
    longitude: schema.number(),
    name: schema.string(),
    cep: schema.string(),
    state: schema.string(),
    city: schema.string(),
    neighborhood: schema.string(),
    street: schema.string(),
    number: schema.string(),
    complement: schema.string.optional(),
    phone: schema.string.optional(),
    whatsapp: schema.string.optional(),
    email: schema.string.optional(),
    email2: schema.string.optional(),
    category: schema.string.optional(),
    site: schema.string.optional(),
    linkedin: schema.string.optional(),
    youtube: schema.string.optional(),
    facebook: schema.string.optional(),
    instagram: schema.string.optional(),
    twitter: schema.string.optional(),
    tiktok: schema.string.optional(),
  })

  public messages = {}
}
