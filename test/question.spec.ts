import User from 'App/Models/User'
import test from 'japa'
import supertest from 'supertest'
import { baseURL } from './config'
import path from 'path'
import fs from 'fs'
import Database from '@ioc:Adonis/Lucid/Database'

let send = {
  email: 'anotherTest2@gmail.com',
  password: '123456',
  password_confirmation: '123456',
  nome: 'Test',
  sobrenome: 'Adonis',
  telefone: '(11)9xxxx-xxxx',
  genero: 'Masculino',
  nascimento: '1989-06-26',
  estade: 'SP',
  cidade: 'São Paulo',
  professor: 1,
}

test.group('Question', (group) => {
  group.before(async () => {
    const user = new User()
    user.email = send.email
    user.password = send.password
    user.nome = send.nome
    user.sobrenome = send.sobrenome
    user.telefone = send.telefone
    user.genero = send.genero
    user.nascimento = new Date()
    user.estado = send.estade
    user.cidade = send.cidade
    user.professor = true
    user.admin = true
    await user.save()
  })

  test('create a new Question', async (assert) => {
    const login = await supertest(baseURL).post('/login').expect(200).send({
      email: send.email,
      password: send.password,
    })

    const responseExame = await supertest(baseURL)
      .post('/novoexame')
      .expect(200)
      .send({ exame: 'enem', localizacao: 'BR' })
      .set({ Authorization: `bearer ${login.body.token.token}` })

    const pathImage = __dirname + '/files/file_ok.jpeg'

    const responseQuestion = await supertest(baseURL)
      .post('/novaquestao')
      .expect(200)
      .field('enemArea', 'Ciências Humanas')
      .field('caderno', 'Branco')
      .field('numero', 1)
      .field('materia', 'História')
      .field('frente1', 'História do Brasil')
      .field('frente2', 'Atualidade')
      .field('frente3', 'Literatura')
      .field('ano', 2019)
      .field('examId', responseExame.body.id)
      .field('alternativa', 'A')
      .field('textoQuestao', 'Texto da Questão')
      .field('textoAlternativaA', 'textoAlternativaA')
      .field('textoAlternativaB', 'textoAlternativaB')
      .field('textoAlternativaC', 'textoAlternativaC')
      .field('textoAlternativaD', 'textoAlternativaD')
      .field('textoAlternativaE', 'textoAlternativaE')
      .attach('image', pathImage)
      .set({ Authorization: `bearer ${login.body.token.token}` })

    const selectQuestion = await supertest(baseURL)
      .get(`/selecionarquestao/${responseQuestion.body.id}`)
      .expect(200)
      .set({ Authorization: `bearer ${login.body.token.token}` })

    assert.equal(selectQuestion.body.materia, 'História')

    await supertest(baseURL)
      .delete(`/deletarquestao/${responseQuestion.body.id}`)
      .expect(200)
      .set({ Authorization: `bearer ${login.body.token.token}` })
  })

  test('create a lot of question', async () => {
    const login = await supertest(baseURL).post('/login').expect(200).send({
      email: "admin@gmail.com",
      password: "123456",
    })
    
    const arquivo = path.join(__dirname, '/files/test_banco2.xlsx')

    await supertest(baseURL)
      .post('/xlsx')
      .set({ Authorization: `bearer ${login.body.token.token}` })
      .attach('planilha', arquivo)
      .expect(200)
      .timeout(30000)

    const questoes = await Database.rawQuery('select count(*) from questoes;')

    console.log(questoes.rows[0])

    //await Database.rawQuery('delete from questoes;')
  }).timeout(30000)

  test('verifica existência de arquivo', (assert) => {
    const file_ok = path.join(__dirname, '/files/file_ok.jpeg')
    const file_corrompido = path.join(__dirname, '/files/file_corrompido.jpeg')

    assert.isTrue(fs.readFileSync(file_corrompido).length == 0)
    assert.isTrue(fs.readFileSync(file_ok).length > 0)
  })
})