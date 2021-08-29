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
  private ArrayReturn: Indices[] = []
  public log: string[] = []
  private errorFirst: boolean
  private errorQuestao: boolean
  private value: Indices
  private userid: number

  constructor(excel: unknown[], userid: number) {
    this.arrayExcel = excel
    this.userid = userid
  }

  public verify() {
    if (this.verifyFirstLine(this.arrayExcel[0])) {
      return { log: this.log, resp: this.ArrayReturn}
    }
    for (let i = 1; i < this.arrayExcel.length; i++) {
      if(!this.verificarCadaQuestao(i)) {
        this.value = {
          ImagemLink: this.arrayExcel[i][0],
          Exam: this.arrayExcel[i][1].toUpperCase(),
          Ano: this.arrayExcel[i][2],
          EnemArea: this.arrayExcel[i][3],
          Materia: this.arrayExcel[i][4],
          Frente1: this.arrayExcel[i][5],
          Frente2: this.arrayExcel[i][6],
          Frente3: this.arrayExcel[i][7],
          Caderno: this.arrayExcel[i][8],
          Numero: this.arrayExcel[i][9],
          Alternativa: this.arrayExcel[i][10],
          TextoQuestao: this.arrayExcel[i][11],
          TextoAlternativaA: this.arrayExcel[i][12],
          TextoAlternativaB: this.arrayExcel[i][13],
          TextoAlternativaC: this.arrayExcel[i][14],
          TextoAlternativaD: this.arrayExcel[i][15],
          TextoAlternativaE: this.arrayExcel[i][16],
        }
        try {
          this.ArrayReturn.push(this.value)
        } catch (err) {
          this.log.push(err)
        }
      }
    }
    return { log: this.log, resp: this.ArrayReturn.length > 0 }
  }

  public async CadastroQuestao1a1(): Promise<string[]> {

    const GoogleDrive = new DownloadGoogleDriveAPI()

    const meuRetorno: string[] = []
    const arrayPromisse: (() => Promise<boolean>)[] = []

    for (let i = 0; i < this.ArrayReturn.length; i++) {

      const examId = await Exam.findBy('exam', this.ArrayReturn[i].Exam)

      if(examId) {
        arrayPromisse.push(
          async (): Promise<boolean> => {

            const fileid = this.ArrayReturn[i].ImagemLink.split('https://drive.google.com/open?id=')[1]

            const nomearquivo = await this.DownloadImages(GoogleDrive, fileid)
            await new Promise<void>(done => setTimeout(() => done(), 1000));

            if(nomearquivo === '') {
              meuRetorno.push(`{ error: Não foi possível localizar a imagem ${this.ArrayReturn[i].ImagemLink}}`)
              return false

            } else {

              try {
                const question = new Questoes()

                question.userId = this.userid
                question.imagemLink = nomearquivo
                question.examId = examId.id
                question.caderno = this.ArrayReturn[i].Caderno
                question.numero = this.ArrayReturn[i].Numero
                question.enemArea = this.ArrayReturn[i].EnemArea
                question.materia = this.ArrayReturn[i].Materia
                question.frente1 = this.ArrayReturn[i].Frente1
                question.frente2 = this.ArrayReturn[i].Frente2
                question.frente3 = this.ArrayReturn[i].Frente3
                question.ano = this.ArrayReturn[i].Ano
                question.alternativa = this.ArrayReturn[i].Alternativa
                question.textoQuestao = this.ArrayReturn[i].TextoQuestao
                question.textoAlternativaA = this.ArrayReturn[i].TextoAlternativaA
                question.textoAlternativaB = this.ArrayReturn[i].TextoAlternativaB
                question.textoAlternativaC = this.ArrayReturn[i].TextoAlternativaC
                question.textoAlternativaD = this.ArrayReturn[i].TextoAlternativaD
                question.textoAlternativaE =  this.ArrayReturn[i].TextoAlternativaE

                await question.save()
                return true
              } catch (error) {
                fs.unlinkSync(replaceDir(nomearquivo, 'images'))
                meuRetorno.push(`{ error: Não foi possível cadastrar Questao ${this.ArrayReturn[i].ImagemLink}. ${error}}`)
                return false
              }
            }
          }
        )
      meuRetorno.push(`{ error: ${this.ArrayReturn[i].Exam} não existe no sistema}`)
      }
        
      await Promise.all(arrayPromisse.map(async (elem) => {
        await new Promise<void>(done => setTimeout(() => done(), 1000));
        elem()
      }))
    }
    return meuRetorno
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
