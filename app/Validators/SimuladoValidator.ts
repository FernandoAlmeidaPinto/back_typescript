import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SimuladoValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
	nome: schema.string({}, [rules.unique({ table: 'simulados', column: 'nome' })]),
	idTipo: schema.number(),
	questoes: schema.array().members(schema.number()),
  })

  public messages = {}
}
