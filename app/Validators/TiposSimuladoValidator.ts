import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Materias } from 'App/Features/BancoQuestoes/ConstantesEnem'

export default class TiposSimuladoValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
	nome: schema.string({}, [rules.unique({ table: 'types_simulados', column: 'name' })]),
	regras: schema.array().members(
	  schema.object().members({
		materia: schema.enum(Object.values(Materias)),
		quantidade: schema.number(),
	  })
	),
  })

  public messages = {}
}
