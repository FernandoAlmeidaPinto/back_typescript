import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RespostaSimuladoValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
	ObjAnswer: schema.array().members(
        schema.object().members({
          idQuestao: schema.number(),
          RespostaEstudante: schema.string(),
        })
      ),
  })

  public messages = {}
}
