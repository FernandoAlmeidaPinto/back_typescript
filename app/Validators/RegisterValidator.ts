import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
  constructor (protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
	email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({ trim: true }, [rules.confirmed()]),
      nome: schema.string({ trim: true }),
      sobrenome: schema.string({}),
      telefone: schema.string({ trim: true }),
      genero: schema.string({}),
      nascimento: schema.date({}),
      estado: schema.string({}),
      cidade: schema.string({}),
      professor: schema.boolean(),
  })

  public messages = {}
}
