import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Geolocations extends BaseSchema {
  protected tableName = 'geolocations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.float('latitude', 9, 6).notNullable()
      table.float('longitude', 9, 6).notNullable()
      table.string('name').notNullable()
      table.string('cep').notNullable()
      table.string('state').notNullable()
      table.string('city').notNullable()
      table.string('neighborhood').notNullable()
      table.string('street').notNullable()
      table.string('number').notNullable()
      table.string('complement')
      table.string('phone')
      table.string('whatsapp')
      table.string('email', 250)
      table.string('email_2', 250)
      table.string('category').defaultTo('gratuito')
      table.string('site')
      table.string('linkedin')
      table.string('youtube')
      table.string('facebook')
      table.string('instagram')
      table.string('twitter')
      table.string('tiktok')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
