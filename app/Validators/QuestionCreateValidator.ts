import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {Alternativa, Caderno } from '../Features/BancoQuestoes/ConstantesEnem'

export default class QuestionCreateValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
	enemArea: schema.number([rules.exists({ table: 'enem_areas', column: 'id' })]),
	caderno: schema.enum(Object.values(Caderno)),
	numero: schema.number(),
	materia: schema.number([rules.exists({ table: 'materias', column: 'id' })]),
	frente1: schema.number([rules.exists({ table: 'frentes', column: 'id' })]),
	frente2: schema.number.optional([rules.exists({ table: 'frentes', column: 'id' })]),
	frente3: schema.number.optional([rules.exists({ table: 'frentes', column: 'id' })]),
	ano: schema.number(),
	examId: schema.number(),
	alternativa: schema.enum(Object.values(Alternativa)),
	textoQuestao: schema.string(),
	textoAlternativaA: schema.string(),
	textoAlternativaB: schema.string(),
	textoAlternativaC: schema.string(),
	textoAlternativaD: schema.string(),
	textoAlternativaE: schema.string(),
  })

  public messages = {}
}
