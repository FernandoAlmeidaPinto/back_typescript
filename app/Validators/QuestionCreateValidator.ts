import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {EnemArea, Materias, Frentes, Alternativa, Caderno } from '../Features/BancoQuestoes/ConstantesEnem'

export default class QuestionCreateValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
	enemArea: schema.enum(Object.values(EnemArea)),
	caderno: schema.enum(Object.values(Caderno)),
	numero: schema.number(),
	materia: schema.enum(Object.values(Materias)),
	frente1: schema.enum(Object.values(Frentes)),
	frente2: schema.enum(Object.values(Frentes)),
	frente3: schema.enum(Object.values(Frentes)),
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
