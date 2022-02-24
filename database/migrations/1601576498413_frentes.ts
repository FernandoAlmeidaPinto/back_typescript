import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Frentes extends BaseSchema {
  protected tableName = 'frentes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('frente').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
