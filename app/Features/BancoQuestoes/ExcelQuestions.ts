import { Indices } from './Tipos/Enem'
import { EnemArea, Materias, Frentes, indices } from './ConstantesEnem'

import { DownloadGoogleDriveAPI } from '../GoogleDriveAPI/Downloader/index'
import { replaceDir } from './ReplaceDir'

import Exam from 'App/Models/Exam'
import Questoes from 'App/Models/Questoes'

import fs from 'fs'

const typeCorrect = ['A', 'B', 'C', 'D', 'E']

export default class ExcelQuestion {
  private arrayExcel: any[]
  private ArrayReturn: Questoes[] = []
  public log: string[] = []
  private errorFirst: boolean
  private errorQuestao: boolean
  private value: Indices
  private userid: number

  constructor(excel: unknown[], userid: number) {
    this.arrayExcel = excel
    this.userid = userid
  }

  public async verify() {
    if (this.verifyFirstLine(this.arrayExcel[0])) {
      return { log: this.log, resp: this.ArrayReturn}
    }
    for (let i = 1; i < this.arrayExcel.length; i++) {
      if(!this.verificarCadaQuestao(i)) {

        const examId = await Exam.findBy('exam', this.arrayExcel[i][1].toUpperCase())

        if(examId) {
          const question = new Questoes()

          question.userId = this.userid
          question.examId = examId.id
          question.imagemLink = this.arrayExcel[i][0]
          question.ano = this.arrayExcel[i][2]
          question.enemArea = this.arrayExcel[i][3]
          question.materia = this.arrayExcel[i][4]
          question.frente1 = this.arrayExcel[i][5]
          question.frente2 = this.arrayExcel[i][6]
          question.frente3 = this.arrayExcel[i][7]
          question.caderno = this.arrayExcel[i][8]
          question.numero = this.arrayExcel[i][9]
          question.alternativa = this.arrayExcel[i][10]
          question.textoQuestao = this.arrayExcel[i][11]
          question.textoAlternativaA = this.arrayExcel[i][12]
          question.textoAlternativaB = this.arrayExcel[i][13]
          question.textoAlternativaC = this.arrayExcel[i][14]
          question.textoAlternativaD = this.arrayExcel[i][15]
          question.textoAlternativaE =  this.arrayExcel[i][16]

          this.ArrayReturn.push(question)

        } else {
          this.log.push('linha: ' + i + ' - ' + this.arrayExcel[i].Exam.toUpperCase() + ' não foi cadastrado')
        }

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

      console.log(nomearquivo)

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

  private verificarCadaQuestao(linha: number) : boolean {
      this.errorQuestao = this.LogGeneration(linha, 3, EnemArea, 'Área do Enem')
      this.errorQuestao = this.errorQuestao ? true : this.LogGeneration(linha, 4, Materias, 'Matéria')
      this.errorQuestao = this.errorQuestao ? true : this.LogGeneration(linha, 5, Frentes, 'Frente')
      this.errorQuestao = this.errorQuestao ? true : this.LogGeneration(linha, 6, Frentes, 'Frente')
      this.errorQuestao = this.errorQuestao ? true : this.LogGeneration(linha, 7, Frentes, 'Frente')
      this.errorQuestao = this.errorQuestao ? true : this.LogGeneration(linha, 10, typeCorrect, 'Alternativa')
      return this.errorQuestao
  }

  private LogGeneration(linha: number, coluna: number, arrayTest: any[], text: string) : boolean {
    if(!this.comparaString(arrayTest, this.arrayExcel[linha][coluna])) {
      if((coluna === 6 || coluna === 7) && this.arrayExcel[linha][coluna] === null) {
        return false
      }
      this.log.push(`{error: linha ${linha} --- ${this.arrayExcel[linha][coluna]} não é uma ${text} Válida}`)
      return true
    }
    return false
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

  private comparaString(list: any[], valor: string) {
    for(let index = 0; index < list.length; index++) {
      if(valor !== null && String(list[index]).normalize('NFKC') === String(valor.normalize('NFKC'))){
        return true
      }
    }
    return false
  }
  
}
