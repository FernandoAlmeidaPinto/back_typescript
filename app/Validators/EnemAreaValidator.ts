import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EnemAreaValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
	enemArea: schema.string()
  })

  public messages = {}
}
