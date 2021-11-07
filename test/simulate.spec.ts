import test from 'japa'
import supertest from 'supertest'
import { baseURL, send} from './config'

test.group('Simulados', (group) => {
  group.before(async () => {

    const sendAdmin = send;

    sendAdmin.email = "simulado@gmail.com"
    sendAdmin.professor = 1
    sendAdmin.password_confirmation = sendAdmin.password

    await supertest(baseURL).post('/cadastro').expect(200).send(sendAdmin)
  })

})
