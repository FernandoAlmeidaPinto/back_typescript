import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FrenteValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
	frente: schema.string()
  })

  public messages = {}
}
