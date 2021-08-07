import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Localizacao } from 'App/Features/BancoQuestoes/Enums/EnumLocalizacao'

export default class ExameValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
	exame: schema.string({ trim: true }, [rules.unique({ table: 'exams', column: 'exam' })]),
	localizacao: schema.enum(Object.values(Localizacao)),
  })

  public messages = {}
}
