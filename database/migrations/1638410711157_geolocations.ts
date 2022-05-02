import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Geolocations extends BaseSchema {
  protected tableName = 'geolocations'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.float('latitude', 9, 6).notNullable()
      table.float('longitude', 9, 6).notNullable()
      table.timestamps(true)

      table.unique(['latitude', 'longitude'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
