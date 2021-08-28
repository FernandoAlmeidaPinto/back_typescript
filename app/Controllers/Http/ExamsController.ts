import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Exam from 'App/Models/Exam'
import ExameValidator from 'App/Validators/ExameValidator'

export default class ExamsController {
  public async NovoExame({ auth, request, response }: HttpContextContract) {
    if(!auth.user?.admin){
      return response.status(401).json({ error: "Você não tem Autorização"})
    }
    const novoExam = await request.validate(ExameValidator)
    
    const exam = new Exam()

    exam.user_id = auth.user?.id
    exam.exam = novoExam.exame.toUpperCase()
    exam.localizacao = novoExam.localizacao
    await exam.save()

    return exam
  }

  public async DelExam({ auth, params, response }: HttpContextContract) {
    if(!auth.user?.admin){
      return response.status(401).json({ error: "Você não tem Autorização"})
    }
    const idExam = params.id

    const exam = await Exam.findByOrFail('id', idExam)

    await exam.delete()
  }

  public async ListarExams({ response }: HttpContextContract) {
    const allExam = await Exam.all()

    return response.status(200).json(allExam)
  }
}
