import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Enem } from '../../Features/BancoQuestoes/ConstantesEnem'
import EnemArea from 'App/Models/EnemArea'
import EnemAreaValidator from 'App/Validators/EnemAreaValidator'
import MateriaValidator from 'App/Validators/MateriaValidator'
import Materia from 'App/Models/Materia'
import FrenteValidator from 'App/Validators/FrenteValidator'
import Frente from 'App/Models/Frente'

export default class EnemsController {

  public async CreateEnemArea({ request, response }: HttpContextContract) {
    const userDetails = await request.validate(EnemAreaValidator)

    const area = await EnemArea.create({
      area: userDetails.enemArea
    })

    return response.status(200).json(area.toJSON())
  }

  public async CreateMateria({ request, response }: HttpContextContract) {
    const userDetails = await request.validate(MateriaValidator)

    const materia = await Materia.create({
      materia: userDetails.materia
    })

    return response.status(200).json(materia.toJSON())
  }

  public async CreateFrente({ request, response }: HttpContextContract) {
    const userDetails = await request.validate(FrenteValidator)

    const frente = await Frente.create({
      frente: userDetails.frente
    })

    return response.status(200).json(frente.toJSON())
  }

  public async DeleteEnemArea({ params, response }: HttpContextContract) {
    const id = await params.id

    const area = await EnemArea.findByOrFail('id', id)

    await area.delete()

    return response.status(200).json({ msg: 'Deletado '})
  }

  public async DeleteMateria({ params, response }: HttpContextContract) {
    const id = await params.id

    const materia = await Materia.findByOrFail('id', id)

    await materia.delete()

    return response.status(200).json({ msg: 'Deletado '})
  }

  public async DeleteFrente({ params, response }: HttpContextContract) {
    const id = await params.id

    const frente = await Frente.findByOrFail('id', id)

    await frente.delete()

    return response.status(200).json({ msg: 'Deletado '})
  }

  public async UpdateEnemArea({ request, response }: HttpContextContract) {
    const { id, area } = await request.only([ 'id', 'area' ])

    const enemarea = await EnemArea.findByOrFail('id', id)

    enemarea.area = area
    await enemarea.save()

    return response.status(200).json(enemarea)
  }

  public async UpdateMateria({ request, response }: HttpContextContract) {
    const { id, materia } = await request.only([ 'id', 'area' ])

    const newMateria = await Materia.findByOrFail('id', id)

    newMateria.materia = materia
    await newMateria.save()

    return response.status(200).json(newMateria)
  }

  public async UpdateFrente({ request, response }: HttpContextContract) {
    const { id, frente } = await request.only([ 'id', 'area' ])

    const newFrente = await Frente.findByOrFail('id', id)

    newFrente.frente = frente
    await newFrente.save()

    return response.status(200).json(newFrente)
  }


  public AllEnem({ response }: HttpContextContract) {
    const value = Enem

    return response.json(value)
  }
}
