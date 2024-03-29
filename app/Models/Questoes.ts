import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Questoes extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null, columnName:'user_id' })
  public userId: number

  @column({ columnName:'exam_id' })
  public examId: number

  @column({ columnName:'imagem_link' })
  public imagemLink: string

  @column({ columnName:'enem_area_id' })
  public enemArea: number

  @column()
  public ano: number

  @column()
  public caderno: string

  @column()
  public numero: number

  @column({ columnName:'materia_id' })
  public materia: number

  @column({ columnName:'frente_1_id' })
  public frente1: number

  @column({ columnName:'frente_2_id' })
  public frente2: number

  @column({ columnName:'frente_2_id' })
  public frente3: number

  @column({ columnName:'texto_questao' })
  public textoQuestao: string

  @column({ columnName:'texto_alternativa_a' })
  public textoAlternativaA: string

  @column({ columnName:'texto_alternativa_b' })
  public textoAlternativaB: string

  @column({ columnName:'texto_alternativa_c' })
  public textoAlternativaC: string

  @column({ columnName:'texto_alternativa_d' })
  public textoAlternativaD: string

  @column({ columnName:'texto_alternativa_e' })
  public textoAlternativaE: string

  @column({ serializeAs: null })
  public dificuldade: number

  @column({ serializeAs: null, columnName:'vezes_respondida' })
  public vezesRespondida: number

  @column({ serializeAs: null, columnName:'quantidade_testes' })
  public quantidadeTestes: number

  @column({ serializeAs: null })
  public historico: number[]


  @column({ serializeAs: null })
  public status: string

  @column({ serializeAs: null })
  public alternativa: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
