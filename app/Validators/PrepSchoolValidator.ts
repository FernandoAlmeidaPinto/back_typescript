import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PrepSchoolValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    name: schema.string(),
    cep: schema.string(),
    state: schema.string(),
    city: schema.string(),
    district: schema.string(),
    street: schema.string(),
    number: schema.string(),
    complement: schema.string(),
    phone: schema.string(),
    whatsapp: schema.string(),
    email: schema.string({}, [rules.email()]),
    email2: schema.string({}, [rules.minLength(0)]),
    category: schema.string(),
    site: schema.string(),
    linkedin: schema.string(),
    youtube: schema.string(),
    facebook: schema.string(),
    instagram: schema.string(),
    twitter: schema.string(),
    tiktok: schema.string(),
    geolocation_id: schema.number(),
  })


  public messages = {}
}
