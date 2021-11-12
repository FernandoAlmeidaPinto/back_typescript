import { indices } from './ConstantesEnem'

import { DownloadGoogleDriveAPI } from '../GoogleDriveAPI/Downloader/index'
import { replaceDir } from './ReplaceDir'

import Exam from 'App/Models/Exam'
import Questoes from 'App/Models/Questoes'

import fs from 'fs'
import EnemArea from 'App/Models/EnemArea'
import Materia from 'App/Models/Materia'
import Frente from 'App/Models/Frente'

export default class ExcelQuestion {
  private arrayExcel: any[]
  private ArrayReturn: Questoes[] = []
  public log: string[] = []
  private errorFirst: boolean
  private userid: number

  constructor(excel: unknown[], userid: number) {
    this.arrayExcel = excel
    this.userid = userid
  }

  public async verify() {
    if (this.verifyFirstLine(this.arrayExcel[0])) {
      return { log: this.log, resp: false}
    }
    for (let i = 1; i < this.arrayExcel.length; i++) {

      let salva = true

      const questao = new Questoes()

      questao.userId = this.userid

      try {
        const enemArea = await EnemArea.findByOrFail('area', this.arrayExcel[i][3])
        questao.enemArea = enemArea.id
      } catch (error) {
        salva = false
        this.log.push( `A area do enem ${this.arrayExcel[i][3]} não foi encontrada`)
      }
      try {
        const materia = await Materia.findByOrFail('id', this.arrayExcel[i][4])
        questao.materia = materia.id
      } catch (error) {
        salva = false
        this.log.push( `A materia ${this.arrayExcel[i][4]} não foi encontrada`)
      }
      try {
        const frente1 = await Frente.findByOrFail('id', this.arrayExcel[i][5])
        questao.frente1 = frente1.id
      } catch (error) {
        salva = false
        this.log.push( `A Frente ${this.arrayExcel[i][5]} não foi encontrada`)
      }
      if(this.arrayExcel[i][6]) {
        try {
          const frente2 = await Frente.findByOrFail('id', this.arrayExcel[i][6])
          questao.frente2 = frente2.id
        } catch (error) {
          salva = false
          this.log.push( `A Frente ${this.arrayExcel[i][6]} não foi encontrada`)
        }
      }
      if(this.arrayExcel[i][7]) {
        try {
          const frente3 = await Frente.findByOrFail('id', this.arrayExcel[i][7])
          questao.frente3 = frente3.id
        } catch (error) {
          salva = false
          this.log.push( `A Frente ${this.arrayExcel[i][7]} não foi encontrada`)
        }
      }
      
      try {
        const myExam = await Exam.findByOrFail('id', this.arrayExcel[i][1].toUpperCase())
        questao.examId = myExam.id
      } catch (error) {
        salva = false
        this.log.push( `O Exame ${this.arrayExcel[i][1].toUpperCase()} não foi encontrado`)
      }

      if(salva) {
      questao.imagemLink = this.arrayExcel[i][0]
      questao.ano = this.arrayExcel[i][2]
      questao.caderno = this.arrayExcel[i][8]
      questao.numero = this.arrayExcel[i][9]
      questao.alternativa = this.arrayExcel[i][10]
      questao.textoQuestao = this.arrayExcel[i][11]
      questao.textoAlternativaA = this.arrayExcel[i][12]
      questao.textoAlternativaB = this.arrayExcel[i][13]
      questao.textoAlternativaC = this.arrayExcel[i][14]
      questao.textoAlternativaD = this.arrayExcel[i][15]
      questao.textoAlternativaE =  this.arrayExcel[i][16]

      this.ArrayReturn.push(questao)
      }
    }
    return { log: this.log, resp: this.ArrayReturn.length > 0 }
  }

  public async CadastroQuestao1a1(): Promise<string[]> {

    const GoogleDrive = new DownloadGoogleDriveAPI()

    const arrayPromisse: (() => Promise<boolean>)[] = []

    for (let i = 0; i < this.ArrayReturn.length; i++) {

      const fileid = this.ArrayReturn[i].imagemLink.split('https://drive.google.com/open?id=')[1]
      const nomearquivo = await this.DownloadImages(GoogleDrive, fileid)

      if(nomearquivo) {
        this.ArrayReturn[i].imagemLink = nomearquivo
        arrayPromisse.push(
          async (): Promise<boolean> => {
            try {
              await this.ArrayReturn[i].save()
              return true
            } catch (error) {
              fs.unlinkSync(replaceDir(nomearquivo, 'images'))
              this.log.push(`{ error: Não foi possível cadastrar Questao ${this.ArrayReturn[i].textoQuestao}. ${error}}`)
              return false
            }
          }
        )
      } else {
        this.log.push(`{ error: ${this.ArrayReturn[i].textoQuestao} não existe no sistema}`)
      }
    }

    await Promise.all(arrayPromisse.map(async (elem) => elem()))

    return this.log
  }

  private async DownloadImages(GoogleDrive, fileid: string): Promise<string> {
    const nomearquivo = `${new Date().getTime()}.jpeg`

    const dest = replaceDir(nomearquivo, 'images')

    if(fileid != '' && await GoogleDrive.Download(fileid, dest)){
      return nomearquivo
    }
    return ''  
  }

  private verifyFirstLine(first: any[]) : boolean {
    this.errorFirst = false
    for (let j = 0; j < first.length; j++) {
      if (first[j] !== indices[j]) {
        const logError = `{error: O campo ${first[j]} não é reconhecido, esperado campo ${indices[j]}}`
        this.log.push(logError)
        this.errorFirst = true
      }
    }
    return this.errorFirst
  }
  
}
