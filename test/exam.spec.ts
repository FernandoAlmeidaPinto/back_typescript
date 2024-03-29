import User from 'App/Models/User'
import test from 'japa'
import supertest from 'supertest'
import { baseURL } from './config'

let send = {
  email: 'testexam@gmail.com',
  password: '123456',
  password_confirmation: '123456',
  nome: 'Test',
  sobrenome: 'Adonis',
  telefone: '(11)9xxxx-xxxx',
  genero: 'Masculino',
  nascimento: '1989-06-26',
  estado: 'SP',
  cidade: 'São Paulo',
  professor: 1,
}

test.group('Exam', () => {
  test('try create a new exam being a teacher, but not admin', async () => {
    await supertest(baseURL).post('/cadastro').expect(200).send(send)

    const responseLogin = await supertest(baseURL).post('/login').expect(200).send({
      email: send.email,
      password: send.password,
    })

    await supertest(baseURL)
      .post('/novoexame')
      .expect(401)
      .send({ exam: 'Fuvest', location: 'SP' })
      .set({ Authorization: `bearer ${responseLogin.body.token.token}` })
  })

  test('create a new exam being a adm', async (assert) => {
    const user = new User()
    user.email = 'anotherTest@gmail.com'
    user.password = send.password
    user.nome = send.nome
    user.sobrenome = send.sobrenome
    user.telefone = send.telefone
    user.genero = send.genero
    user.nascimento = new Date()
    user.estado = send.estado
    user.cidade = send.cidade
    user.professor = true
    user.admin = true
    await user.save()

    const responseLogin = await supertest(baseURL).post('/login').expect(200).send({
      email: 'anotherTest@gmail.com',
      password: send.password,
    })

    await supertest(baseURL)
      .post('/novoexame')
      .expect(200)
      .send({ exame: 'Fuvest', localizacao: 'SP' })
      .set({ Authorization: `bearer ${responseLogin.body.token.token}` })
    
    const respListExam = await supertest(baseURL)
      .get('/listarexams')
      .expect(200)
      .set({ Authorization: `bearer ${responseLogin.body.token.token}` })

    assert.exists(respListExam.body[0].exam)
  })

  test('create a exam alread exist', async () => {
    const responseLogin = await supertest(baseURL).post('/login').expect(200).send({
      email: 'anotherTest@gmail.com',
      password: send.password,
    })
   
    await supertest(baseURL)
      .post('/novoexame')
      .expect(422)
      .send({ exam: 'Fuvest', localizacao: 'SP' })
      .set({ Authorization: `bearer ${responseLogin.body.token.token}` })
  })

  test('delete a exam alread exist', async () => {
    const responseLogin = await supertest(baseURL).post('/login').expect(200).send({
      email: 'anotherTest@gmail.com',
      password: send.password,
    })

    await supertest(baseURL)
      .delete('/delexam/1')
      .expect(200)
      .set({ Authorization: `bearer ${responseLogin.body.token.token}` })
  })

  test('delete a exam not exist', async () => {
    const responseLogin = await supertest(baseURL).post('/login').expect(200).send({
      email: 'anotherTest@gmail.com',
      password: send.password,
    })

    await supertest(baseURL)
      .delete('/delexam/1')
      .expect(404)
      .set({ Authorization: `bearer ${responseLogin.body.token.token}` })
  })
})