import Database from '@ioc:Adonis/Lucid/Database'
import test from 'japa'
import supertest from 'supertest'
import { baseURL, send, fields } from './config'

test.group('Auth', () => {
  test('register a student', async (assert) => {
    const data = await supertest(baseURL).post('/cadastro').expect(200).send(send)
    assert.equal(data.body.user.email, send.email)
  })

  test('register without nothing', async (assert) => {
    const newsend = {}
    const data = await supertest(baseURL).post('/cadastro').expect(422).send(newsend)
    const errors = data.body.errors
    for (let i = 0; i < 10; i++) {
      assert.equal(errors[i].field, fields[i])
    }
  })
  test('register password_confirmed wrong', async (assert) => {
    const newsend = send
    newsend.email = 'test3@gmail.com'
    newsend.password_confirmation = '123457'
    const data = await supertest(baseURL).post('/cadastro').expect(422).send(newsend)
    const errors = data.body.errors
    assert.equal(errors[0].field, 'password_confirmation')
    assert.equal(errors[0].message, 'confirmed validation failed')
  })

  test('login without nothing', async (assert) => {
    const login0 = {}
    const data = await supertest(baseURL).post('/login').expect(422).send(login0)
    assert.equal(data.body.errors[0].message, 'required validation failed')
    assert.equal(data.body.errors[0].field, 'email')
    assert.equal(data.body.errors[1].message, 'required validation failed')
    assert.equal(data.body.errors[1].field, 'password')
  })

  test('login without email', async (assert) => {
    const login1 = { password: '123456' }
    const data = await supertest(baseURL).post('/login').expect(422).send(login1)
    assert.equal(data.body.errors[0].message, 'required validation failed')
  })

  test('login without password', async (assert) => {
    const login2 = { email: 'test@gmail.com' }
    const data = await supertest(baseURL).post('/login').expect(422).send(login2)
    assert.equal(data.body.errors[0].message, 'required validation failed')
  })

  test('login with email wrong', async (assert) => {
    const login3 = { email: 'test4@gmail.com', password: '123456' }
    const data = await supertest(baseURL).post('/login').expect(404).send(login3)
    assert.equal(data.body.message, 'E_ROW_NOT_FOUND: Row not found')
  })

  test('login with password wrong', async (assert) => {
    const login4 = { email: 'test@gmail.com', password: '123457' }
    const data = await supertest(baseURL).post('/login').expect(400).send(login4)
    assert.equal(data.body.errors[0].message, 'Invalid user credentials')
  })

  test('login with all correct', async (assert) => {
    const login5 = { email: 'test@gmail.com', password: '123456' }
    const data = await supertest(baseURL).post('/login').expect(200).send(login5)
    assert.equal(data.body.user.email, login5.email)
  })

  test('me return', async (assert) => {
    const login5 = { email: 'test@gmail.com', password: '123456' }
    const responseLogin = await supertest(baseURL).post('/login').expect(200).send(login5)

    const responseMe = await supertest(baseURL)
      .get('/me')
      .set({ Authorization: `bearer ${responseLogin.body.token.token}` })

    assert.exists(responseMe.body.email)
  })

  test('patchme change nome', async (assert) => {
    const login6 = { email: 'test@gmail.com', password: '123456' }
    const responseLogin = await supertest(baseURL).post('/login').expect(200).send(login6)

    await supertest(baseURL)
      .put('/patchme')
      .set({ Authorization: `bearer ${responseLogin.body.token.token}` })
      .send({ nome: 'Teste' })

    const responseMe = await supertest(baseURL)
      .get('/me')
      .set({ Authorization: `bearer ${responseLogin.body.token.token}` })

    assert.equal(responseMe.body.nome, 'Teste')
  })

  test('delete user', async (assert) => {
    const sendAdmin = send;

    sendAdmin.email = "admin@gmail.com"
    sendAdmin.professor = 1
    sendAdmin.password_confirmation = sendAdmin.password

    const cadastro = await supertest(baseURL)
                            .post('/cadastro')
                            .expect(200)
                            .send(sendAdmin)
    assert.equal(cadastro.body.user.email, sendAdmin.email)
    await Database.rawQuery(`update users set admin = true where id = ${cadastro.body.user.id}`)

    await supertest(baseURL)
      .get(`/deleteuser/${1}`)
      .set({ Authorization: `bearer ${cadastro.body.token.token}` })
      .expect(200)

    const consulta = await Database.rawQuery('select * from users;')

    assert.isTrue(consulta.rows.length == 1)
  })
})