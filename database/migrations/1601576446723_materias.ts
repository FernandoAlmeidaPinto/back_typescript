import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Materias extends BaseSchema {
  protected tableName = 'materias'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('materia').notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
