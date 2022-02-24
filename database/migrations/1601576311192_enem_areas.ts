import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EnemAreas extends BaseSchema {
  protected tableName = 'enem_areas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('area').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
