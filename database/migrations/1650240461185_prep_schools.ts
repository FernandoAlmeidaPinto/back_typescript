import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PrepSchools extends BaseSchema {
  protected tableName = 'prep_schools'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('cep').notNullable()
      table.string('state').notNullable()
      table.string('city').notNullable()
      table.string('district').notNullable()
      table.string('street').notNullable()
      table.string('number').notNullable()
      table.string('complement')
      table.string('phone')
      table.string('whatsapp')
      table.string('email', 250)
      table.string('email_2', 250)
      table.string('category')
      table.string('site')
      table.string('linkedin')
      table.string('youtube')
      table.string('facebook')
      table.string('instagram')
      table.string('twitter')
      table.string('tiktok')
      table.integer('geolocation_id')
        .unsigned()
        .references('id')
        .inTable('geolocations')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
