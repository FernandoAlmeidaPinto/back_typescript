import test from 'japa'
import supertest from 'supertest'
import { baseURL, send} from './config'

test.group('Simulados', (group) => {
  group.before(async (assert) => {

    const sendAdmin = send;

    sendAdmin.email = "admin@gmail.com"
    sendAdmin.professor = 1
    sendAdmin.password_confirmation = sendAdmin.password

    const cadastro = await supertest(baseURL)
                            .post('/cadastro')
                            .expect(200)
                            .send(sendAdmin)
    assert.equal(1,1)

    const login = await supertest(baseURL).post('/login').expect(200).send({
        email: send.email,
        password: send.password,
      })
  })

  test('2+2', async (assert) => {
    assert.equal(2 + 2, 4)
  }) 
})

