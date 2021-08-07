import User from 'App/Models/User'
import test from 'japa'
import supertest from 'supertest'
import { baseURL } from './config'

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

    const pathImage = __dirname + '/files/ImageTest.jpg'

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
})