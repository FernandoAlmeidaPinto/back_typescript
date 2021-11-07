import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RespostasSimulado from '../../Features/Simulados/RespostasSimulado'
import CriarSimulado from '../../Features/Simulados/CriarSimulados'
import Simulado from 'App/Models/Simulado'
import TipoSimulado from 'App/Models/TipoSimulado'
import { Resposta, RespostaCorreta } from '../../Features/Simulados/Tipos/Resposta'
import TiposSimuladoValidator from 'App/Validators/TiposSimuladoValidator'
import SimuladoValidator from 'App/Validators/SimuladoValidator'
//import RespostaSimuladoValidator from 'App/Validators/RespostaSimuladoValidator'

export default class SimuladosController {

  public async CriarTipo({ auth, request, response }: HttpContextContract) {
    if (!auth.user?.professor && !auth.user?.admin) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }

    const typeDetails = await request.validate(TiposSimuladoValidator)

    let quantTotalQuestion = 0
    typeDetails.regras.map(regra => {
      quantTotalQuestion =+ regra.quantidade
    })

    const tipo = new TipoSimulado()

    tipo.nome = typeDetails.nome
    tipo.quantidadeTotalQuestoes = quantTotalQuestion
    tipo.regra = typeDetails.regras

    tipo.save()

    return response.status(200).json(tipo)
  }

  public async DeletarTipo({ auth, params, response }: HttpContextContract) {
    if (!auth.user?.professor && !auth.user?.admin) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }
    const idType = params.id

    const type = await TipoSimulado.findByOrFail('id', idType)

    type.delete()
  }

  public async ListarTipos({ response }: HttpContextContract) {
    const allTypes = await TipoSimulado.all()

    return response.json(allTypes)
  }

  public async CriarSimulado({ auth, request, response }: HttpContextContract) {
    if (!auth.user?.professor && !auth.user?.admin) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }

    const data = await request.validate(SimuladoValidator)

    const tipo = await TipoSimulado.findByOrFail('id', data.idTipo)

    const Simulado = new CriarSimulado(data.nome, tipo, data.questoes)

    const idSimulado = Simulado.CriarSimulados()

    return response.status(200).send(idSimulado)
  }

  public async ChamarSimulado({ params }: HttpContextContract) {
    const meuSimulado = await Simulado.findOrFail('id', params.id)

    return meuSimulado
  }

  public async RespostaSimulado({ request }: HttpContextContract): Promise<RespostaCorreta[]> {

    const respostaRecebida : Resposta[] = await request.only(['Resposta_Recebida'])

    const ObjResposta = new RespostasSimulado(respostaRecebida)

    const Resposta = await ObjResposta.VerificandoResposta()

    return Resposta
  }
}
