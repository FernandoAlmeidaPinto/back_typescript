import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Enem } from '../../../Features/BancoQuestoes/ConstantesEnem'

export default class EnemsController {
  public AllEnem({ response }: HttpContextContract) {
    const value = Enem

    return response.json(value)
  }
}
