import User from 'App/Models/User'
import Token from 'App/Models/Token'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { createUser } from '../../Features/Auth/createUser'
import LoginValidator from 'App/Validators/LoginValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthController {
  public async register({ auth, request, response }: HttpContextContract) {
    
    const userDetails = await request.validate(RegisterValidator)

    const { sobre } = request.only(['sobre'])

    const log : {erro: boolean, errorlog: string, user: User} = await createUser(userDetails, sobre)

    if(log.erro){
      return response.status(422).json(log.errorlog)
    }

    const token = await auth.use('api').attempt(userDetails.email, userDetails.password)

    return response.status(200).json({ user: log.user.toJSON(), token: token.toJSON()})
  }

  public async login({ request, auth, response }: HttpContextContract) {

    const { email, password } = await request.validate(LoginValidator)

    const user = await User.findByOrFail('email', email)
    const oldtoken = await Token.findBy('user_id', user.toJSON().id)
    if(oldtoken){
      await oldtoken.delete()
    }
    const token = await auth.use('api').attempt(email, password)
    return response.json({ user: user.toJSON(), token: token.toJSON()})
  }

  public async logout({ auth }: HttpContextContract){
    await auth.logout()
  }

  public async me({ auth, response }: HttpContextContract) {
    return response.status(200).json({
      email: auth.user?.email,
      nome: auth.user?.nome,
      sobrenome: auth.user?.sobrenome,
      genero: auth.user?.genero,
      telefone: auth.user?.telefone,
      nascimento: auth.user?.nascimento,
      estado: auth.user?.estado,
      cidade: auth.user?.cidade,
      professor: auth.user?.professor,
    })
  }

  public async patchme({ auth, response, request }: HttpContextContract) {
    try {
      const user = await User.findByOrFail('id', auth.user?.id)

      const data = request.all()

      user.nome = data.nome ? data.nome : user.nome 
      user.sobrenome = data.sobrenome ? data.sobrenome : user.sobrenome
      user.telefone = data.telefone? data.telefone : user.telefone
      user.genero = data.genero ? data.genero : user.genero
      user.nascimento = data.nascimento ? data.nascimento : user.nascimento
      user.estado = data.estado? data.estado : user.estado
      user.cidade = data.cidade ? data.cidade : user.cidade
      user.sobre = data.sobre ? data.sobre :  user.sobre
      user.password = data.password ? data.password : user.password

      await user.save()

      return response.status(200).json(user)

    } catch (error) {
      return response.status(404).json({ error: error })
    }
  }

  public async patchAdmin({ auth, request, response }: HttpContextContract) {
    if (!auth.user?.admin) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }

    const user = await User.findByOrFail('id', request.input('id'))

    user.admin = user.admin ? false : true
    await user.save()
  }

  public async delete({ auth, params, response }: HttpContextContract) {
    if(auth.user?.admin == true){
      const user = await User.findByOrFail('id', params.id)
      await user.delete()
      return response.status(200).json({ msg: 'User Deletado' })
    }
    return response.status(401).json({ msg: 'Não Autorizado' })
  }
}
