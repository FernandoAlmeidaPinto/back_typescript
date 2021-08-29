export const sleep = (ms: number) => {
    return new Promise(resolver => setTimeout(resolver, ms))
}

export const baseURL = `http://localhost:${process.env.PORT}`

export const send = {
    email: 'test@gmail.com',
    password: '123456',
    password_confirmation: '123456',
    nome: 'Test',
    sobrenome: 'Adonis',
    telefone: '(11)9xxxx-xxxx',
    genero: 'Masculino',
    nascimento: '1989-06-26',
    estado: 'SP',
    cidade: 'São Paulo',
    professor: 0,
}

export const fields = [
    'email',
    'password',
    'nome',
    'sobrenome',
    'telefone',
    'genero',
    'nascimento',
    'estado',
    'cidade',
    'professor',
]