import Questao from "App/Models/Questoes";

export type RespostaCorreta = {
    questao: Questao
    respostaEstudante: string
    respostaCorreta: string
}

export type Resposta = {
    idQuestao: number
    RespostaEstudante: string
}