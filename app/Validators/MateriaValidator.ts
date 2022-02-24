import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MateriaValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
	  materia: schema.string()
  })

  public messages = {}
}
