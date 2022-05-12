#!/usr/bin/env bash

######################################################################
# Nome: Voce na facul
# Email: dev.vocenafacul@gmail.com
#
# Nome do programa: script de inicializacao do servidor
# Versao: 0.1.0
# Licenca: GPLv2
# Descricao: Este programa instala e inicial os recursos necessarios
#            para o seridor ficar em execucao no ambiente de producao
#
# CHANGELOG:
# 12/05/2022 - Leonardo do Nascimento
#    - [Adicionado] Funcionalidade para iniciar o servidor
# NEWS: PS1 => caminho no terminal
######################################################################
set -e # se der erro, saia!

################################### Dependencies
sudo npm i -g pm2
sudo npm i -g yarn
yarn install
################################################


################################### Build
yarn build
cp .env ./build
docker-compose up --build -d
yarn migration
#########################################


################################### Start
pm2 start build/server.js --name vcnafacul
#########################################
