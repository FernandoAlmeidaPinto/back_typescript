import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Geolocation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public latitude: number

  @column()
  public longitude: number

  @column()
  public name: string

  @column()
  public cep: string

  @column()
  public state: string

  @column()
  public city: string

  @column()
  public neighborhood: string

  @column()
  public street: string

  @column()
  public number: string

  @column()
  public complement: string

  @column()
  public phone: string

  @column()
  public whatsapp: string

  @column()
  public email: string

  @column()
  public email2: string

  @column()
  public category: string

  @column()
  public site: string

  @column()
  public linkedin: string

  @column()
  public youtube: string

  @column()
  public facebook: string

  @column()
  public instagram: string

  @column()
  public twitter: string

  @column()
  public tiktok: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
