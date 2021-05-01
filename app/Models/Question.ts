import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { Correct, EnemArea, Frentes, StatusQuestion, Subjects } from 'Projetos/Enums/Question'

export default class Question extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public user_id: number

  @column()
  public exam_id: number

  @column()
  public ImagemLink: string

  @column()
  public enem_area: EnemArea

  @column()
  public subjects: Subjects

  @column()
  public frente1: Frentes

  @column()
  public frente2: Frentes

  @column()
  public frente3: Frentes

  @column({ serializeAs: null })
  public difficulty: number

  @column({ serializeAs: null })
  public quantity: number

  @column({ serializeAs: null })
  public quantity_test: number

  @column({ serializeAs: null })
  public history_test: number[]

  @column()
  public year: number

  @column({ serializeAs: null })
  public status: StatusQuestion

  @column({ serializeAs: null })
  public correct: Correct

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
