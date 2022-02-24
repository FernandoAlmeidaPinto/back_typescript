import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import readXlsxFile from 'read-excel-file/node'

import Exam from 'App/Models/Exam'
import Questoes from 'App/Models/Questoes'
import ExcelQuestion from '../../Features/BancoQuestoes/ExcelQuestions'
//import {EnemArea, Materias, Frentes, Alternativa } from '../../Features/BancoQuestoes/ConstantesEnem'

import ValidatorQuestion from '../../Validators/QuestionCreateValidator'

import { replaceDir } from 'App/Features/BancoQuestoes/ReplaceDir'
import fs from 'fs'
import EnemArea from 'App/Models/EnemArea'
import Materia from 'App/Models/Materia'
import Frente from 'App/Models/Frente'


export default class QuestionsController {

  public async NovaQuestao({ auth, request, response }: HttpContextContract) {
    if (!auth.user?.professor) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }

    const questionDetails = await request.validate(ValidatorQuestion)

    const questao = new Questoes()

    questao.userId = auth.user.id

    try {
      const enemArea = await EnemArea.findByOrFail('id', questionDetails.enemArea)
      questao.enemArea = enemArea.id
    } catch (error) {
      return response.status(400).json('Area do Enem não encontrada')
    }
    try {
      const materia = await Materia.findByOrFail('id', questionDetails.materia)
      questao.materia = materia.id
    } catch (error) {
      return response.status(400).json('Area do Enem não encontrada')
    }
    try {
      const frente1 = await Frente.findByOrFail('id', questionDetails.frente1)
      questao.frente1 = frente1.id
    } catch (error) {
      return response.status(400).json('Area do Enem não encontrada')
    }
    if(questionDetails.frente2) {
      try {
        const frente2 = await Frente.findByOrFail('id', questionDetails.frente2)
        questao.frente2 = frente2.id
      } catch (error) {
        return response.status(400).json('Area do Enem não encontrada')
      }
    }
    if(questionDetails.frente3) {
      try {
        const frente3 = await Frente.findByOrFail('id', questionDetails.frente3)
        questao.frente3 = frente3.id
      } catch (error) {
        return response.status(400).json('Area do Enem não encontrada')
      }
    }
    try {
      const myExam = await Exam.findByOrFail('id', questionDetails.examId)
      questao.examId = myExam.id
    } catch (error) {
      return response.status(400).json('Area do Enem não encontrada')
    }

    const myImage = request.file('image', {
      size: '0.2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (!myImage) {
      return response.status(400).json({ error: 'File not found' })
    }

    if (myImage.hasErrors) {
      return response.status(400).json({ error: myImage.errors }) 
    }

    const name = `${new Date().getTime()}.${myImage.extname}`

    if (
      !myImage.move('../uploads/images', {
        name: name,
        overwrite: false,
      })
    ) {
      response.status(404)
      return myImage.errors
    }

    questao.imagemLink = name
    questao.caderno = questionDetails.caderno
    questao.numero = questionDetails.numero
    questao.textoQuestao = questionDetails.textoQuestao
    questao.textoAlternativaA = questionDetails.textoAlternativaA
    questao.textoAlternativaB = questionDetails.textoAlternativaB
    questao.textoAlternativaC = questionDetails.textoAlternativaC
    questao.textoAlternativaD = questionDetails.textoAlternativaD
    questao.textoAlternativaE =  questionDetails.textoAlternativaE
    questao.ano = questionDetails.ano
    questao.alternativa = questionDetails.alternativa

    await questao.save()

    return questao
  }

  public async DeletarQuestao({ auth, params, response }: HttpContextContract) {
    if (!auth.user?.professor) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }

    const IdQuestao = params.id

    const questao = await Questoes.findByOrFail('id', IdQuestao)

    const path = replaceDir(questao.imagemLink, 'images')

    try {
      fs.unlinkSync(path)
      await questao.delete()
    } catch (err) {
      return response.json({ error: err })
    }
  }

  public async SelecionarQuestao({ params, response }: HttpContextContract) {

    const IdQuestao = params.id

    const questao = await Questoes.findByOrFail('id', IdQuestao)

    return response.json(questao)
  }

  // Função precisa ser revisada ... 
  public async XlsxUploadQuestion({ auth, request, response }: HttpContextContract) {
    if (!auth.user?.professor) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }

    const excel = request.file('planilha', {
      size: '2mb',
      extnames: ['xlsx', 'csv'],
    })

    if (!excel) {
      return response.status(400).json({ error: 'File not found' })
    }
    
    if (excel.hasErrors) {
      return response.json({ error: excel.errors }) 
    }
    const nome = `${new Date().getTime()}.${excel.extname}`

    try {
      await excel.move('../uploads/excel/', {
        name: nome,
        overwrite: true,
      })
    } catch (err) {
      response.status(404).json({ error: err })
      return err
    }

    const path = replaceDir(nome, 'excel')

    const myFile = await readXlsxFile(path)
    
    const excelClass = new ExcelQuestion(myFile, auth.user?.id)
    const data = await excelClass.verify()

    if(data.resp) {
      data.log = await excelClass.CadastroQuestao1a1()
    }
    
    return response.status(200).json({ error: data.log })
  }
  
  public async ListarQuestoes({ response }: HttpContextContract) {
    return response.json(await Questoes.all())
  }

}
