import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import readXlsxFile from 'read-excel-file/node'

import Exam from 'App/Models/Exam'
import Questao from 'App/Models/Questoes'
import ExcelQuestion from '../../Features/BancoQuestoes/ExcelQuestions'
//import {EnemArea, Materias, Frentes, Alternativa } from '../../Features/BancoQuestoes/ConstantesEnem'

import ValidatorQuestion from '../../Validators/QuestionCreateValidator'

import { replaceDir } from 'App/Features/BancoQuestoes/ReplaceDir'
import fs from 'fs'


export default class QuestionsController {

  public async NovaQuestao({ auth, request, response }: HttpContextContract) {
    if (!auth.user?.professor) {
      return response.status(401).json({ error: 'Você não tem Autorização' })
    }

    const questionDetails = await request.validate(ValidatorQuestion)

    const myExam = await Exam.findBy('id', questionDetails.examId)

    if (myExam === null) {
      return response.status(400).json({ msg: 'O Exame selecionado não encontrado em nossa base' })
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

    const questao = new Questao()

    questao.userId = auth.user.id
    questao.imagemLink = name
    questao.examId = questionDetails.examId
    questao.enemArea = questionDetails.enemArea
    questao.caderno = questionDetails.caderno
    questao.numero = questionDetails.numero
    questao.textoQuestao = questionDetails.textoQuestao
    questao.textoAlternativaA = questionDetails.textoAlternativaA
    questao.textoAlternativaB = questionDetails.textoAlternativaB
    questao.textoAlternativaC = questionDetails.textoAlternativaC
    questao.textoAlternativaD = questionDetails.textoAlternativaD
    questao.textoAlternativaE =  questionDetails.textoAlternativaE
    questao.materia = questionDetails.materia
    questao.frente1 = questionDetails.frente1
    questao.frente2 = questionDetails.frente2
    questao.frente3 = questionDetails.frente3
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

    const questao = await Questao.findByOrFail('id', IdQuestao)

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

    const questao = await Questao.findByOrFail('id', IdQuestao)

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
    return response.json(await Questao.all())
  }
}
