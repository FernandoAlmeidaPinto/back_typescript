import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { EnemArea, Materias, Frentes, StatusQuestion } from '../../app/Features/BancoQuestoes/ConstantesEnem'

export default class Questions extends BaseSchema {
  protected tableName = 'questoes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table
        .integer('exam_id')
        .unsigned()
        .references('id')
        .inTable('exams')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
        
      table.string('imagem_link').notNullable().unique()

      table.integer('enem_area_id')
        .unsigned()
        .references('id')
        .inTable('enem_areas')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()

      table.integer('ano').notNullable()

      table.integer('materia_id')
        .unsigned()
        .references('id')
        .inTable('materias')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()

      table.enum('frente_1', Frentes).notNullable()
      table.integer('frente_1_id')
        .unsigned()
        .references('id')
        .inTable('frentes')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()

      table.integer('frente_2_id')
        .unsigned()
        .references('id')
        .inTable('frentes')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table.integer('frente_3_id')
        .unsigned()
        .references('id')
        .inTable('frentes')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table.enum('caderno', ['Azul', 'Amarelo', 'Rosa', 'Branco', 'Cinza'])

      table.integer('numero').unsigned()

      table.enum('alternativa', ['A', 'B', 'C', 'D', 'E']).notNullable()

      table.text('texto_questao', 'longtext')

      table.text('texto_alternativa_a', 'longtext')

      table.text('texto_alternativa_b', 'longtext')

      table.text('texto_alternativa_c', 'longtext')

      table.text('texto_alternativa_d', 'longtext')

      table.text('texto_alternativa_e', 'longtext')

      table.integer('dificuldade').defaultTo(0).notNullable()

      table.integer('vezes_respondida').defaultTo(0).notNullable()

      table.integer('quantidade_testes').defaultTo(0).notNullable()
      table.json('historico').defaultTo(0).notNullable()
      table.enum('status', StatusQuestion).defaultTo('aprovada')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
